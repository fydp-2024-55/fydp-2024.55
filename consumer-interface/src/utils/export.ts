import { SubscriptionResult } from "../types";

export const exportDataToCSV = (data: SubscriptionResult[]) => {
  // Exclude `interests` key from the exported data
  const titleKeys = Object.keys(data[0]).filter((key) => key !== "interests");

  const refinedData = [];
  refinedData.push(titleKeys);

  data.forEach((item) => {
    // Exclude `interests` from the exported data
    const { interests, ...values } = item;
    refinedData.push(Object.values(values));
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

export const exportDataToJSON = (data: SubscriptionResult[]) => {
  // Exclude `interests` from the exported data
  const result = data.map(({ interests, ...rest }) => rest);

  const jsonContent =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(result));

  const element = document.createElement("a");
  element.setAttribute("href", jsonContent);
  element.setAttribute("download", "data.json");

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
