export const safeParse = (data) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (e) {
    console.error("Parse error:", e);
    return [];
  }
};