import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Header } from "./Header"

describe("Header", () => {
  it("shows top navigation links for service marketplace", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByText("Browse Services")).toBeInTheDocument()
    expect(screen.getByText("Find Professionals")).toBeInTheDocument()
    expect(screen.getByText("How It Works")).toBeInTheDocument()
  })

  it("opens the navigation menu when toggle is clicked", () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )
    const toggle = screen.getByRole("button", { name: /toggle navigation/i })
    const nav = container.querySelector("#navbarNav")

    expect(nav).not.toHaveClass("is-open")
    fireEvent.click(toggle)
    expect(nav).toHaveClass("is-open")
  })
})
