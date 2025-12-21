import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export interface DragEndEvent {
  active: { id: string };
  over: { id: string } | null;
}

export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

export interface Transition {
  property: string;
  easing: string;
  duration: number;
}

export interface DragHandleAttributes {
  role: string;
  "aria-describedby": string;
  tabIndex: number;
}

export interface DragHandleListeners {
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onPointerDown?: (event: React.PointerEvent) => void;
}

export interface DragHandleProps {
  ref: React.Ref<HTMLDivElement>;
  attributes: DragHandleAttributes;
  listeners: SyntheticListenerMap | undefined;
  onClick: (e: React.MouseEvent) => void;
}

export interface ReorderStatusProps {
  isReordering: boolean;
}
