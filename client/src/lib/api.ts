import { getToken, clearToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  auth?: boolean; // whether to include the JWT — defaults to false
};

type ApiResponse<T> =
  | {
    ok: true;
    data: T;
    count?: number;
  }
  | {
    ok: false;
    error: string;
  };

export async function api<T>(
  path: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    // Auto-redirect on 401 only for authenticated requests — i.e. a token that
    // expired or became invalid mid-session. A 401 from a public request (e.g.
    // wrong credentials on login) is a normal error the caller displays inline;
    // redirecting there would reload the page and wipe the error message.
    if (res.status === 401 && auth) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return { ok: false, error: json.error ?? "Session expired" };
    }

    if (!res.ok) {
      return { ok: false, error: json.error ?? "Something went wrong" };
    }

    return { ok: true, data: json.data, count: json.count };
  } catch {
    return { ok: false, error: "Network error — is the server running?" };
  }
}
