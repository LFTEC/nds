

import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string
  }

  interface session {
    user: {
      username: string
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
          return session;
        },
        jwt: ({token, user}) => {
          
          if(user) {
            token.username = user.username;
          }

          return token;
        }
    },
    trustHost: true
} satisfies NextAuthConfig;