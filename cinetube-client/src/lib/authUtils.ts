export type UserRole = "ADMIN" | "USER";

export const isAuthRoute = (pathname: string): boolean => {
  return ["/login", "/register"].includes(pathname);
};

export const getRouteOwner = (pathname: string): string | null => {
  if (pathname.startsWith("/admin")) {
    return "ADMIN";
  }
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/watchlist") || pathname.startsWith("/profile")) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole | null): string => {
  if (role === "ADMIN") return "/admin/dashboard";
  return "/";
};