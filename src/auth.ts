import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { getUserInfo } from "@/services/userService";
import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {z} from 'zod';
import bcrypt from 'bcrypt';


export interface CUser extends User {
    username: string,
    password: string
};

async function getUser(username: string): Promise<CUser|undefined> {
    try {
        username = username.toLowerCase().trim();
        const user = await getUserInfo(username);
        return user;
    } catch(error) {
        console.error(`用户${username}不存在`, error);
        throw new Error(`用户${username}不存在`,{cause: error});
    }
}

export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const parsedCredential = z.object({
                    username: z.string(),
                    password: z.string().min(8)
                }).safeParse(credentials);

                if(parsedCredential.success) {
                    const {username, password} = parsedCredential.data;
                    const user = await getUser(username);
                    if(!user) return null;
                    const bMatch = await bcrypt.compare(password, user.password);
                    if(bMatch) return user as CUser;
                }

                console.log("invalid credentials");
                return null;
            },
        })
    ],
    trustHost: true
    
});