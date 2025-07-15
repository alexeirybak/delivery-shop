export interface PriceRangeSliderProps {
  min: number;
  max: number;
  values: [number, number] | number[];
  onChangeAction: (values: [number, number]) => void;
}
