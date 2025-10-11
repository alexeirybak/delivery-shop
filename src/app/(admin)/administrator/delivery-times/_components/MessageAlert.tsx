interface MessageAlertProps {
  message: string;
  type: "success" | "error";
}

export default function MessageAlert({ message, type }: MessageAlertProps) {
  return (
    <div
      className={`p-3 md:p-4 mb-4 rounded border ${
        type === "success"
          ? "bg-[#e5ffde] text-[#008c49]"
          : "bg-[#ffc7c7] text-[#d80000]"
      }`}
    >
      {message}
    </div>
  );
}
