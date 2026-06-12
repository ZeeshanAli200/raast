type FetchResult<T> = {
  data: T | null;
  error: string | null;
};

export async function serverFetch<T>(
  url: string,
  options?: RequestInit,
  transform?: (data: unknown) => T
): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url, {
      cache: 'no-store', // or 'force-cache' depending on your need
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const json = await res.json();

    const finalData = transform ? transform(json) : json;

    return { data: finalData, error: null };
  } catch (err) {
    return {
      data: null,
      error: (err as { message: string })?.message || 'Something went wrong',
    };
  }
}
