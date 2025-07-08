import { RefObject } from "react";
import { Category } from "./categories";
import { ErrorProps } from "./errorProps";

export interface CatalogMenuProps {
  isLoading: boolean;
  isCatalogOpen: boolean;
  setIsCatalogOpen: (open: boolean) => void;
  categories: Category[];
  searchBlockRef: RefObject<HTMLDivElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  error: ErrorProps | null;
  onMouseEnter: () => void;
  onFocusChangeAction: (focuced: boolean) => void;
}
