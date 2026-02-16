export type SelectProps<T = any> = {
  data: T[];
  loading: boolean;
  search?: string;
  pageSize?: number;
  placeholder?: string;
  onChange?: (value: T) => void;
  loadMore?: () => void;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
};
