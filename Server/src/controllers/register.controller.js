export const register = async (req, res) => {
const { name, email, password, role } = req.body

const hashed = await bcrypt.hash(password, 10)

await User.create({
name,
email,
password: hashed,
role
})

res.json({ message: "User created" })
}
console.log("HASH TYPE:", typeof user.password)
console.log("HASH VALUE:", user.password)