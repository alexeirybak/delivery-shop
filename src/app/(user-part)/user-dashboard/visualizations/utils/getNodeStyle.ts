export const getNodeStyle = (type: string) => {
  switch (type) {
    case "start":
    case "end":
      return {
        background: "#d1fae5",
        border: "2px solid #10b981",
        borderRadius: "20px",
      };
    case "decision":
      return {
        background: "#fef3c7",
        border: "2px solid #f59e0b",
      };
    case "input":
    case "output":
      return {
        background: "#dbeafe",
        border: "2px solid #3b82f6",
      };
    default:
      return {
        background: "#f3e8ff",
        border: "2px solid #a855f7",
        borderRadius: "8px",
      };
  }
};
