// c45Worker.js

// Fungsi pembantu untuk memberikan jeda waktu (sleep) agar UI bisa merender progres
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

self.onmessage = async function (e) {
  const { rawDataset, targetAttribute, predictorFeatures, cleaningStrategy, featureTypes, sourceFileName } = e.data;

  // Helper untuk kirim update log progres ke UI React
  const sendLog = (message, progress, type = "INFO") => {
    self.postMessage({ type: "PROGRESS", message, progress, logType: type });
  };

  sendLog(`> [Worker] Memuat ${rawDataset.length} baris data dari file: ${sourceFileName}`, 10);
  await sleep(400); // Jeda agar UI render step 1
  
  sendLog(`> [Worker] Menjalankan strategi [${cleaningStrategy.toUpperCase()}]...`, 20);
  await sleep(400);

  const totalRaw = rawDataset.length;
  let cleanedData = [];
  let droppedCount = 0;
  let imputedCount = 0;

  // ==========================================
  // FASE 1: PEMBERSIHAN DATA (IMPUTE / DROP)
  // ==========================================
  const imputationValues = {};
  predictorFeatures.forEach(feat => {
    const validValues = rawDataset
      .map(d => d[feat])
      .filter(v => v !== null && v !== undefined && String(v).trim() !== "");

    if (featureTypes[feat] === "Kontinu") {
      const sortedNums = validValues.map(v => parseFloat(v)).sort((a, b) => a - b);
      if (sortedNums.length > 0) {
        const mid = Math.floor(sortedNums.length / 2);
        imputationValues[feat] = sortedNums.length % 2 !== 0 ? sortedNums[mid] : (sortedNums[mid - 1] + sortedNums[mid]) / 2;
      } else {
        imputationValues[feat] = 0;
      }
    } else {
      const frequencies = {};
      let maxFreq = 0;
      let modeVal = "";
      validValues.forEach(v => {
        frequencies[v] = (frequencies[v] || 0) + 1;
        if (frequencies[v] > maxFreq) {
          maxFreq = frequencies[v];
          modeVal = v;
        }
      });
      imputationValues[feat] = modeVal;
    }
  });

  if (cleaningStrategy === "drop") {
    cleanedData = rawDataset.filter(row => {
      const isTargetValid = row[targetAttribute] !== null && row[targetAttribute] !== undefined && String(row[targetAttribute]).trim() !== "";
      const areFeaturesValid = predictorFeatures.every(feat => row[feat] !== null && row[feat] !== undefined && String(row[feat]).trim() !== "");
      return isTargetValid && areFeaturesValid;
    });
    droppedCount = totalRaw - cleanedData.length;
  } else {
    for (let i = 0; i < totalRaw; i++) {
      const row = rawDataset[i];
      const isTargetMissing = row[targetAttribute] === null || row[targetAttribute] === undefined || String(row[targetAttribute]).trim() === "";
      
      if (isTargetMissing) {
        droppedCount++; 
        continue;
      }

      let clonedRow = { ...row };
      let isImputed = false;

      for (let j = 0; j < predictorFeatures.length; j++) {
        const feat = predictorFeatures[j];
        const value = row[feat];
        if (value === null || value === undefined || String(value).trim() === "") {
          clonedRow[feat] = imputationValues[feat];
          isImputed = true;
        }
      }

      if (isImputed) imputedCount++;
      cleanedData.push(clonedRow);
    }
  }

  sendLog(`> [SUCCESS] Fase 1 Pembersihan Selesai. Lolos: ${cleanedData.length} | Dibuang: ${droppedCount}`, 50, "SUCCESS");
  await sleep(500); // Jeda transisi ke step 2

  // ==========================================
  // FASE 2: MEDIAN SPLITTING C4.5
  // ==========================================
  sendLog(`> [Worker] Menghitung Median Split untuk diskretisasi kontinu...`, 60);
  const medians = {};
  const attributeSummaries = {};

  predictorFeatures.forEach(feat => {
    if (featureTypes[feat] === "Kontinu") {
      const values = cleanedData.map(d => parseFloat(d[feat])).sort((a, b) => a - b);
      let medianVal = 0;
      if (values.length > 0) {
        const mid = Math.floor(values.length / 2);
        medianVal = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
      }
      medians[feat] = medianVal;
      attributeSummaries[feat] = `Kontinu (Median Split: ${medianVal})`;
    } else {
      attributeSummaries[feat] = "Kategorial (Utuh/Diskrit)";
    }
  });

  const binnedDataset = new Array(cleanedData.length);
  for (let i = 0; i < cleanedData.length; i++) {
    const row = cleanedData[i];
    const transformedRow = { ...row };
    for (let j = 0; j < predictorFeatures.length; j++) {
      const feat = predictorFeatures[j];
      if (featureTypes[feat] === "Kontinu") {
        const numVal = parseFloat(row[feat]);
        transformedRow[`${feat}_binned`] = numVal <= medians[feat] ? `<= ${medians[feat]}` : `> ${medians[feat]}`;
      } else {
        transformedRow[`${feat}_binned`] = row[feat];
      }
    }
    binnedDataset[i] = transformedRow;
  }

  sendLog(`> [SUCCESS] Fase 2 Selesai. Seluruh atribut kontinu dipisahkan berdasarkan median.`, 80, "SUCCESS");
  await sleep(500); // Jeda transisi ke step 3

  // ==========================================
  // FASE 3: SHANNON BASE ENTROPY TARGET
  // ==========================================
  sendLog(`> [Worker] Menghitung nilai dasar Entropy Target Multi-Class...`, 85);
  const classCounts = {};
  for (let i = 0; i < binnedDataset.length; i++) {
    const label = binnedDataset[i][targetAttribute];
    if (label) classCounts[label] = (classCounts[label] || 0) + 1;
  }

  let baseEntropy = 0;
  const totalClean = binnedDataset.length;
  Object.values(classCounts).forEach(count => {
    const p = count / totalClean;
    if (p > 0) baseEntropy -= p * Math.log2(p);
  });
  const formattedEntropy = baseEntropy.toFixed(4);

  sendLog(`> [SUCCESS] Rumus Entropy Terkunci. Base Entropy Aktual = ${formattedEntropy}`, 95, "SUCCESS");
  await sleep(400); // Jeda transisi ke penyelesaian akhir

  // ==========================================
  // PENGIRIMAN DATA BALIK KE REACT UI
  // ==========================================
  self.postMessage({
    type: "SUCCESS",
    payload: {
      finalMetrics: {
        totalRaw,
        totalClean,
        dropped: droppedCount,
        imputed: imputedCount,
        medians,
        baseEntropy: formattedEntropy,
        classCounts,
        featureTypes,
        strategy: cleaningStrategy
      },
      sampleRows: binnedDataset.slice(0, 5),
      binnedDataset: binnedDataset
    }
  });
};