export default function RoleGuard({ role, children }) {
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user || user.role !== role) return null

  return children
}
