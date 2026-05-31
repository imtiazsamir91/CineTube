import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokensWithRefreshToken, getUserInfo } from "./service/auth.services";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithRefreshToken(refreshToken);
    return !!refresh;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const isAuth = isAuthRoute(pathname);

    if (!accessToken) {
      if (isAuth) {
        return NextResponse.next();
      }
      const routerOwner = getRouteOwner(pathname);
      if (routerOwner === null) {
        return NextResponse.next();
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    const tokenVerification = jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string);
    const isValidAccessToken = tokenVerification?.success || false;
    const decodedAccessToken = tokenVerification?.data;

    let userRole: UserRole | null = null;
    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routerOwner = getRouteOwner(pathname);

    if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken))) {
      const requestHeaders = new Headers(request.headers);
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);
        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
      return response;
    }

    if (isAuth && isValidAccessToken && pathname !== "/verify-email" && pathname !== "/reset-password") {
      return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
    }

    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");
      if (accessToken && email) {
        const userInfo = await getUserInfo();
        if (userInfo?.needPasswordChange) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
        }
      }
      if (email) return NextResponse.next();

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    if (routerOwner === null) {
      return NextResponse.next();
    }

    if (!isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    if (accessToken) {
      const userInfo = await getUserInfo();
      if (userInfo) {
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }
          return NextResponse.next();
        }

        if (userInfo.emailVerified && pathname === "/verify-email") {
          return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
        }

        if (userInfo.needPasswordChange) {
          if (pathname !== "/reset-password") {
            const resetPasswordUrl = new URL("/reset-password", request.url);
            resetPasswordUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(resetPasswordUrl);
          }
          return NextResponse.next();
        }

        if (!userInfo.needPasswordChange && pathname === "/reset-password") {
          return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
        }
      }
    }

    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    if (routerOwner === "ADMIN") {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)"],
};