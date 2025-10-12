interface MessageAlertProps {
  message: string;
}

export default function MessageAlert({ message }: MessageAlertProps) {
  return (
    <div className="p-3 md:p-4 mb-4 rounded border bg-[#e5ffde] text-[#008c49]">
      {message}
    </div>
  );
}
