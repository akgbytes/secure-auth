export const capitalize = (name: string) =>
  name
    .toLowerCase()
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
    .join(" ");
