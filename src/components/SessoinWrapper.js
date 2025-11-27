"use client"
import { SessionProvider } from "next-auth/react"

export default function SessoinWrapper({children}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}