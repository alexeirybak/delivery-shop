export interface SearchInputProps {
  query: string;
  setQuery: (value: string) => void;
  handleSearch: () => void;
  handleInputFocus: () => void;
  handleInputBlur: () => void;
}
