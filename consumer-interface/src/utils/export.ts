import { Subscription } from "../types";

export const exportDataToCSV = (data: Subscription[]) => {
  // Exclude `history` key from the exported data
  const titleKeys = Object.keys(data[0]).slice(0, -1);

  const refinedData = [];
  refinedData.push(titleKeys);

  data.forEach((item) => {
    // Exclude `history` from the exported data
    refinedData.push(Object.values(item).slice(0, -1));
  });

  let csvContent = "";
  refinedData.forEach((row) => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
  const objUrl = URL.createObjectURL(blob);

  const element = document.createElement("a");
  element.setAttribute("href", objUrl);
  element.setAttribute("download", "data.csv");

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const exportDataToJSON = (data: Subscription[]) => {
  const jsonContent =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

  const element = document.createElement("a");
  element.setAttribute("href", jsonContent);
  element.setAttribute("download", "data.json");

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
