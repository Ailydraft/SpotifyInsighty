import Papa from "papaparse";

export const loadSpotifyData = async () => {
  const response = await fetch("/data/dataset.csv");

  const csvText = await response.text();

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data;
};