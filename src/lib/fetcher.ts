export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(errorBody?.message || `Request failed for ${url}`);
  }

  const result = (await response.json()) as { data: T };
  return result.data;
}
