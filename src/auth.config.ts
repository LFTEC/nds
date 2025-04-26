
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login"
    },
    providers:[],
    callbacks: {
        authorized: ({auth, request:{nextUrl}}) => {
            const isOnMain = nextUrl.pathname.startsWith('/main');
            const isLoggedIn = !!auth?.user;
            if(isOnMain){
                if(isLoggedIn) return true;
                return false;
            } else if(isLoggedIn) {
                return Response.redirect(new URL('/main', nextUrl));
            }

            return true;
        }
    }
} satisfies NextAuthConfig;