export interface PriceInputsProps {
  from: string;
  to: string;
  min: number;
  max: number;
  onFromChangeAction: (value: string) => void;
  onToChangeAction: (value: string) => void;
}
