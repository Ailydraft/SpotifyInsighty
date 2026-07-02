import Papa from "papaparse";

export const loadSpotifyData = async () => {
  // Menggunakan BASE_URL agar jalurnya otomatis menyesuaikan saat di laptop maupun di GitHub Pages
  const response = await fetch(`${import.meta.env.BASE_URL}data/dataset.csv`);

  const csvText = await response.text();

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data;
};