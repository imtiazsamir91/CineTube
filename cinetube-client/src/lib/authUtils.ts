// Import removed: not used in this file
export type UserRole = "ADMIN" | "USER";

export const isAuthRoute = (pathname: string): boolean => {
  return ["/login", "/register"].includes(pathname);
};

export const getRouteOwner = (pathname: string): string | null => {
  const path = pathname.toLowerCase();
  if (path.startsWith("/admin")) {
    return "ADMIN";
  }
  if (path.startsWith("/dashboard") || path.startsWith("/watchlist") || path.startsWith("/profile")) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: string | null): string => {
  if (!role) return "/";
  const upperRole = role.toUpperCase();
  if (upperRole === "ADMIN") return "/admin/dashboard";
  return "/";
};

export const isValidRedirectForRole = (pathname: string, role: string): boolean => {
  if (!pathname.startsWith("/")) return false;
  
  const routeOwner = getRouteOwner(pathname);
  if (routeOwner === null || routeOwner === "COMMON") return true;
  
  return routeOwner === role.toUpperCase();
};