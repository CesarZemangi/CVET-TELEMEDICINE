import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
{ name: "Resolved", value: 8 },
{ name: "Pending", value: 4 }
]

const COLORS = ["#16a34a", "#9ca3af"]

export default function CaseChart() {
return (
<ResponsiveContainer width="100%" height={200}>
<PieChart>
<Pie data={data} dataKey="value" outerRadius={80} >
{data.map((_, index) => (
<Cell key={index} fill={COLORS[index]} />
))}
</Pie>
</PieChart>
</ResponsiveContainer>
)
}