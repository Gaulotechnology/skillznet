import type { ReactNode } from "react"
import { Header } from "../components/common/Header"
import { Footer } from "../components/common/Footer"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div id="wt-wrapper" className="wt-wrapper wt-haslayout">
      <div className="wt-contentwrapper">
        <Header />
        <main id="wt-main" className="wt-main wt-haslayout">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
