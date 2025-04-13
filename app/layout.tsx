"use client";

import type React from "react"
import "./globals.css"
import { Metadata } from 'next'
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { metadata as appMetadata } from '../metadata'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">     
      <body className={inter.className}>
          <div className="flex flex-col min-h-screen">
            <header className="bg-gray-800 p-4">
              <h1 className="text-2xl font-bold text-white">New Haven Colony</h1>
            </header>
            <main className="flex-grow bg-gray-900 p-4">
              <div className="container mx-auto">
                <div className="flex flex-col items-center justify-center min-h-screen">
                  {children}
                </div>
              </div>
            </main>
            <footer className="bg-gray-800 p-4">
              <p className="text-sm text-gray-400">
                &copy; 2023 New Haven Colony. All rights reserved.
              </p>
            </footer>
          </div>
      </body>
    </html>
  )
}