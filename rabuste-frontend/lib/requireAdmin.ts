export async function requireAdmin() {
  // development shortcut — return true when running locally to avoid backend calls
  if (process.env.NODE_ENV === "development") return true;

  // ensure this helper is only executed on the server
  if (typeof window !== "undefined") {
    // if accidentally executed on the client, deny access
    return false;
  }

  // dynamically import next/headers so this module doesn't force a client bundle
  const { headers } = await import("next/headers");

  // read raw Cookie header and extract the token (works reliably with Turbopack)
  const cookieHeader = headers().get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  const cookie = match?.[1];
  if (!cookie) return false;

  try {
    const res = await fetch(`${process.env.AUTH_BACKEND_URL}/auth/verify`, {
      headers: {
        Cookie: `token=${cookie}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return false;
    const data = await res.json();
    return data?.role === "admin";
  } catch {
    return false;
  }
}
