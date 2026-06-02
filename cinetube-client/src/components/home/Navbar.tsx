import { cookies } from "next/headers";
// import { jwtUtils } from "@/lib/axios/jwtUtils";
import NavbarClient from "./NavbarClient";
import { jwtUtils } from "@/lib/jwtUtils";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  let user = null;
  if (token) {
    
    user = jwtUtils.decodedToken(token);
  }

  return <NavbarClient initialUser={user} />;
}