import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = "0n3app70url34d3r53cr3t2026";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function setSession(user: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });
  const cookieStore = await cookies();

  cookieStore.set("oatl_session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set("oatl_session", "", { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("oatl_session")?.value;
  if (!sessionCookie) return null;
  try {
    return await decrypt(sessionCookie);
  } catch (error) {
    return null;
  }
}
