export const buildQueryString = (params: Record<string, string | number | undefined>): string => {
  const filtered = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return filtered ? `?${filtered}` : '';
};

export const parseQueryParams = (
  searchParams: URLSearchParams,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {};

  searchParams.forEach((value, key) => {
    if (key === 'limit' || key === 'offset') {
      params[key] = parseInt(value, 10);
    } else {
      params[key] = value;
    }
  });

  return params;
};
