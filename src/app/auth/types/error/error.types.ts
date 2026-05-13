import { ReactNode } from "react";

export type ErrorContentProps = {
  error: string | null;
  icon?: ReactNode;
  title?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
  secondaryAction?: {
    label: string | React.ReactNode;
    onClick: () => void;
    className?: string;
  };
};
