import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const sessionId = request.cookies.get("sessionId");

  // If no sessionId cookie, create one
  if (!sessionId) {
    const newSessionId = crypto.randomUUID(); // ✅ Edge-safe

    response.cookies.set("sessionId", newSessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all routes except:
     * - api routes
     * - static files
     * - images
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
