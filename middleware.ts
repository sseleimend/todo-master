import { clerkMiddleware } from "@clerk/nextjs/server";
import { MiddlewareConfig } from "next/server";

export default clerkMiddleware();

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
