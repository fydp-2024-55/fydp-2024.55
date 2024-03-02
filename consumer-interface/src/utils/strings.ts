export const camelCaseToHumanReadable = (str: string) => {
  let processed =
    str
      .split(/(?=[A-Z])/)
      .join(" ")
      .match(/[a-zA-Z]+|\d+/g)
      ?.join(" ") || "";
  return processed.charAt(0).toUpperCase() + processed.slice(1);
};
