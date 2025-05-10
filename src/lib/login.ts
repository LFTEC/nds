
'use server'
import { signIn, signOut } from "@/auth";
import { AuthError, CredentialsSignin } from "next-auth";

export async function authenticate(prefState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if(error instanceof AuthError){
            if(error instanceof CredentialsSignin) {
                return '输入的账号密码不匹配，请检查！';    
            } else {
                return '系统错误，请稍后再试！';
            }
        }
        
        throw error;      
    }
}

export async function logout() {
  await signOut({redirectTo: '/login'});
}