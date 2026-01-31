import { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function Feedback() {
  const [ratingFilter, setRatingFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All")
  const [feedbackList, setFeedbackList] = useState([])

  useEffect(() => {
    fetch(
      `/api/feedback?rating=${ratingFilter}&topic=${topicFilter}`
    )
      .then(res => res.json())
      .then(data => {
        setFeedbackList(data.feedback)
      })
      .catch(err => console.error(err))
  }, [ratingFilter, topicFilter])

  return (
    <DashboardSection title="Farmer Feedback (Zimbabwe)">
      <p>Recent farmer feedback on veterinary consultations.</p>

      <div className="mb-3 d-flex gap-2">
        {["All", "5", "4", "3", "2"].map(rating => (
          <button
            key={rating}
            className={`btn btn-sm ${
              ratingFilter === rating
                ? "btn-brown"
                : "btn-outline-brown"
            }`}
            onClick={() => setRatingFilter(rating)}
          >
            {rating === "All" ? "All Ratings" : `${rating}⭐`}
          </button>
        ))}
      </div>

      <div className="mb-3 d-flex gap-2">
        {[
          "All",
          "Consultation",
          "Treatment",
          "Vaccination",
          "Nutrition",
          "Screening"
        ].map(topic => (
          <button
            key={topic}
            className={`btn btn-sm ${
              topicFilter === topic
                ? "btn-brown"
                : "btn-outline-brown"
            }`}
            onClick={() => setTopicFilter(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <ul className="list-group">
        {feedbackList.map(item => (
          <li key={item.id} className="list-group-item">
            <strong>{item.farmer}</strong> , {item.rating}⭐ ({item.topic})
            <br />
            <em>"{item.comment}"</em>
            <br />
            <small className="text-muted">{item.date}</small>
          </li>
        ))}

        {feedbackList.length === 0 && (
          <li className="list-group-item text-muted">
            No feedback found for {ratingFilter}⭐ in {topicFilter}.
          </li>
        )}
      </ul>
    </DashboardSection>
  )
}
