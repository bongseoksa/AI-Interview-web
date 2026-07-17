import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - API routes, _next, _vercel
    // - Files with dots (favicon.ico, images, etc.)
    "/((?!api|trpc|_next|_vercel|.*\\..*$).*)",
  ],
};
