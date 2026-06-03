"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(
  email: string,
  password: string,
  callbackUrl: string
) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
    
    // Catch Next.js redirect errors so we can return success and handle routing on the client
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      return { success: true }
    }
    
    throw error
  }
}
