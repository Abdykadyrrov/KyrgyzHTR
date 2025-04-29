import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ru", "kg"],
  defaultLocale: "ru",
});

export const config = {
  matcher: ["/", "/(ru|en|kg)/:path*"],
};
