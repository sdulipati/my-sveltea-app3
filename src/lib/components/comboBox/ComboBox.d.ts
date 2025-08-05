export interface ComboBoxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ComboBoxProps {
  options: ComboBoxOption[];
  placeholder?: string;
  value?: string | null;
  disabled?: boolean;
  onSelect?: (option: ComboBoxOption) => void;
}