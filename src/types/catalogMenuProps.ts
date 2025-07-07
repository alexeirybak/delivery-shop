import { RefObject } from "react";
import { Category } from "./categories";
import { ErrorState } from "./errorState";

export interface CatalogMenuProps {
  isCatalogOpen: boolean;
  isLoading: boolean;
  error: ErrorState;
  categories: Category[];
  isSearchFocused: boolean;
  searchBlockRef: RefObject<HTMLDivElement>;
  menuRef: RefObject<HTMLDivElement>;
  onFocusChangeAction: (focused: boolean) => void;
  setIsCatalogOpen: (open: boolean) => void;
  onMouseEnter: () => void;
}
