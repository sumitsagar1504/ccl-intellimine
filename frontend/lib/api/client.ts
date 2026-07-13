/**
 * API Client for IntelliMine backend (Render)
 * All requests go through Next.js so the auth token is forwarded server-side safely.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ccl-intellimine.onrender.com';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('intellimine_token');
  } catch {
    return null;
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    // 8s timeout — Render free tier can be slow on cold start
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    throw new APIError(res.status, `API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
