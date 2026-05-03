export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function requestJson<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `İstek başarısız (Durum: ${response.status})`,
    );
  }

  return data as T;
}
