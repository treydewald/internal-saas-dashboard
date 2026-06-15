export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export const sortData = <T extends Record<string, any>>(
  data: T[],
  sortConfig: SortConfig | null
): T[] => {
  if (!sortConfig) return data;

  const sorted = [...data];
  sorted.sort((a, b) => {
    const aValue = a[sortConfig.column];
    const bValue = b[sortConfig.column];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number') {
      const comparison = aValue - bValue;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    }

    return 0;
  });

  return sorted;
};

export const filterData = <T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  searchableFields: (keyof T)[]
): T[] => {
  if (!searchTerm) return data;

  const lowerSearch = searchTerm.toLowerCase();
  return data.filter(item =>
    searchableFields.some(field => {
      const value = item[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(lowerSearch);
    })
  );
};
