import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import getOrCreateDB from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  try {
    await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
  } catch (error) {
    console.warn("Error initializing services:", error);
    // Continue even if storage setup fails (e.g., bucket limit reached)
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  /* match all request paths except for the the ones that starts with:
  - api
  - _next/static
  - _next/image
  - favicon.com

  */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
