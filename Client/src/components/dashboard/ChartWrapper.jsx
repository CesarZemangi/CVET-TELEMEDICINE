import { Pie, Doughnut, Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement
)

export default function ChartWrapper({ type, data, options }) {
  if (type === "pie") return <Pie data={data} options={options} />
  if (type === "doughnut") return <Doughnut data={data} options={options} />
  if (type === "line") return <Line data={data} options={options} />
  if (type === "bar") return <Bar data={data} options={options} />

  return null
}
