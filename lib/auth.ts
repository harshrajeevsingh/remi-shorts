import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

import { connectToDatabase } from "./db";
import User from "@/models/User";

export const authOption: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){

                if(!credentials?.email && !credentials?.password){
                    throw new Error("Missing email, password")
                }

                try {
                    await connectToDatabase()

                    const user = User.findOne({email: credentials.email})

                    if(!user){
                        throw new Error("User not found")
                    }

                    const isValidUser = await bcrypt.compare(credentials.password, user.password)

                    if(!isValidUser){
                        throw new Error("Invalid password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    throw error
                }
            }
        })
    ], 
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session, token}){
            if(session.user){
                session.user.id = token.id as string
            }

            return session
        }
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    }, 
    pages:{
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET
}