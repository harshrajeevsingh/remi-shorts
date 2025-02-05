import { authOption } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOption)

export {handler as POST, handler as GET};