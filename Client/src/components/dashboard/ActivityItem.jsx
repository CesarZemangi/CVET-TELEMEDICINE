export default function ActivityItem({ text, time }) {
  return (
    <div className="d-flex justify-content-between py-2 border-bottom">
      <span style={{ color: "#6b4a2d" }}>{text}</span>
      <small style={{ color: "#8b6a4d" }}>{time}</small>
    </div>
  )
}
