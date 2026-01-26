import { Button } from "./ui/button"

export default function Navbar({ dark, toggleDark }) {
  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-6">
      <p className="font-semibold">CVET Telemedicine</p>

      <Button variant="outline" onClick={toggleDark}>
        {dark ? "Light Mode" : "Dark Mode"}
      </Button>
    </header>
  )
}
