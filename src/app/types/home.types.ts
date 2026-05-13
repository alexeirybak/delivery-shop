import { ReactNode } from "react";

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  size: "sm" | "md" | "lg";
  r: number;
  delay: string;
}

export interface AmbientVideoSource {
  src: string;
  type: string;
}

export interface AmbientVideoProps {
  className?: string;
  posterClassName?: string;
  sources: AmbientVideoSource[];
  title: string;
}

export interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
}

export interface StackCard {
  title: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface PanelHighlight {
  label: string;
  value: string;
}

export interface SchedulerCell {
  day: string;
  task: string;
  active: boolean;
}

export interface PricingPlan {
  name: string;
  price: string;
  text: string;
  features: string[];
}

export interface FooterColumn {
  title: string;
  links: string[];
}
