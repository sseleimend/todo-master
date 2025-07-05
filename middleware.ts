import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook/register",
  "/sign-up",
  "/sign-in",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const { userId } = await auth();

    if (!userId && isPublicRoute(req)) return;

    if (!userId && !isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId as string);
    const role = user.publicMetadata.role as string | undefined;

    if (role === "admin" && req.nextUrl.pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (isPublicRoute(req)) {
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", req.url)
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/error", req.url));
  }
});

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
