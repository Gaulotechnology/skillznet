import type { ReactNode } from "react"
import { Header } from "../components/common/Header"
import { Footer } from "../components/common/Footer"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div id="wt-wrapper" className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="wt-main" className="flex-1 w-full p-0 m-0">
        {children}
      </main>
      <Footer />
    </div>
  )
}
