import CloseButton from "./CloseButton";

type AuthFormVariant = "register" | "default";

export const AuthFormLayout = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: AuthFormVariant;
}) => (
  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141] backdrop-blur-sm py-10 px-3">
    <div
      className={`
      relative bg-white rounded shadow-(--shadow-auth-form) w-full
      ${variant === "register" ? "max-w-[687px]" : "max-w-[420px]"}
      max-h-[calc(100vh-80px)] flex flex-col px-6
    `}
    >
      <CloseButton />
      <div className="pt-18 pb-10 overflow-y-auto flex-1">
        {children}
      </div>
    </div>
  </div>
);
