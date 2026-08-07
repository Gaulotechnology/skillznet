import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import App from "./App"

function renderApp(initialEntries: string[] = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  )
}

describe("App seeker flow", () => {
  it("syncs hero professional dropdown with search form category", async () => {
    const user = userEvent.setup()
    renderApp()

    const heroSelect = screen.getByRole("combobox", { name: /select professional category/i })
    await user.selectOptions(heroSelect, "electrical")

    const serviceCategorySelect = screen.getByLabelText(/service category/i)
    expect(serviceCategorySelect).toHaveValue("electrical")
  })

  it("shows fallback providers when live API is unavailable", async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("network down"))

    renderApp()

    await user.click(screen.getByRole("button", { name: /find providers/i }))

    await waitFor(() => {
      expect(screen.getByText(/showing demo providers for hiring flow/i)).toBeInTheDocument()
      expect(screen.getAllByText(/sipho plumbing services/i).length).toBeGreaterThan(0)
    })
  })

  it("supports Zimbabwe city filtering with province-labeled options", async () => {
    const user = userEvent.setup()
    renderApp()

    const cityFilter = screen.getByLabelText(/zimbabwean city/i)
    expect(screen.getByRole("option", { name: /Harare \(Harare\)/i })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: /Bulawayo \(Bulawayo\)/i })).toBeInTheDocument()

    await user.selectOptions(cityFilter, "Bulawayo")
    expect(cityFilter).toHaveValue("Bulawayo")
  })

  it("reads service from query params for jump-link filtering", () => {
    renderApp(["/?service=cleaning"])
    const serviceCategorySelect = screen.getByLabelText(/service category/i)
    expect(serviceCategorySelect).toHaveValue("cleaning")
  })
})
