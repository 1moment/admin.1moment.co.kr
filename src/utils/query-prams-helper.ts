export function createSearchParamsFromExisting(
  existingParams: URLSearchParams,
  keysToPreserve: string[],
  newParams: Record<string, string | null | undefined>,
) {
  const params = new URLSearchParams();

  for (const key of keysToPreserve) {
    const value = existingParams.get(key);
    if (value) {
      params.set(key, value);
    }
  }

  for (const [key, value] of Object.entries(newParams)) {
    if (value != null) {
      params.set(key, value);
    }
  }

  return `?${params}`;
}
