const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = opts.headers || {};
  if (opts.body && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Attach token if present
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...opts, headers });
  const contentType = res.headers.get("content-type") || "";

  // If unauthorized, clear token and redirect to login
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.text();
}

export default apiFetch;
