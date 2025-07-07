import { RefObject } from "react";
import { Category } from "./categories";

export interface CatalogMenuProps {
  isCatalogOpen: boolean;
  isLoading: boolean;
  categories: Category[];
  isSearchFocused: boolean;
  searchBlockRef: RefObject<HTMLDivElement>;
  menuRef: RefObject<HTMLDivElement>;
  onFocusChangeAction: (focused: boolean) => void;
  setIsCatalogOpen: (open: boolean) => void;
  onMouseEnter: () => void;
}
