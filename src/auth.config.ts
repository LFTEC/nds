

import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string
  }

  interface session {
    user: {
      id: string
      username: string
      name?: string | null
      email?: string | null
    }
  }
}

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
        },   
        session: ({session, token, user}) =>{
          session.user.id = token.sub || user.id;
          session.userId = token.sub || user.id;
          session.user.username = String(token.username);
          session.user.name = String(token.name || "");
          session.user.email = String(token.email || "");
          return session;
        },
        jwt: ({token, user}) => {
          
          if(user) {
            token.username = user.username;
            token.name = user.name;
            token.email = user.email;
          }

          return token;
        }
    },
    trustHost: true,
    session: {
      maxAge: 86400
    }
} satisfies NextAuthConfig;