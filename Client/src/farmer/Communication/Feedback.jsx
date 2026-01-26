import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function Feedback() {
  const [ratingFilter, setRatingFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All")

  const feedbackList = [
    { id: 1, farmer: "Tendai Moyo", rating: 5, topic: "Treatment", comment: "Excellent consultation, very clear advice on mastitis treatment.", date: "Jan 10, 2026" },
    { id: 2, farmer: "Rudo Chikafu", rating: 4, topic: "Nutrition", comment: "Helpful, but needed more detail on goat nutrition.", date: "Jan 12, 2026" },
    { id: 3, farmer: "Blessing Ncube", rating: 5, topic: "Vaccination", comment: "Quick diagnosis and effective vaccination plan for poultry.", date: "Jan 14, 2026" },
    { id: 4, farmer: "Tatenda Dube", rating: 3, topic: "Consultation", comment: "Consultation was good, but follow-up in Matabeleland was delayed.", date: "Jan 15, 2026" },
    { id: 5, farmer: "Nyasha Sibanda", rating: 4, topic: "Nutrition", comment: "Clear instructions on sorghum stover feeding, easy to follow.", date: "Jan 17, 2026" },
    { id: 6, farmer: "Chipo Mutasa", rating: 5, topic: "Screening", comment: "Vet was very patient and supportive during brucellosis screening.", date: "Jan 18, 2026" },
    { id: 7, farmer: "Tafadzwa Mhlanga", rating: 2, topic: "Treatment", comment: "Consultation felt rushed, not enough explanation on tick control.", date: "Jan 20, 2026" },
    { id: 8, farmer: "Kudakwashe Dlamini", rating: 5, topic: "Treatment", comment: "Great experience, my goats recovered quickly after PPR treatment.", date: "Jan 22, 2026" },
    { id: 9, farmer: "Ropafadzo Nkomo", rating: 4, topic: "Consultation", comment: "Good advice, but technical terms were confusing for communal farmers.", date: "Jan 23, 2026" },
    { id: 10, farmer: "Simba Chirwa", rating: 5, topic: "Consultation", comment: "Very professional and thorough consultation on dairy herd management.", date: "Jan 25, 2026" }
  ]

  const filteredFeedback = feedbackList.filter(item =>
    (ratingFilter === "All" ? true : item.rating === parseInt(ratingFilter)) &&
    (topicFilter === "All" ? true : item.topic === topicFilter)
  )

  return (
    <DashboardSection title="Farmer Feedback (Zimbabwe)">
      <p>Recent farmer feedback on veterinary consultations:</p>

      {/* Rating filter */}
      <div className="mb-3 d-flex gap-2">
        {["All", "5", "4", "3", "2"].map(rating => (
          <button
            key={rating}
            className={`btn btn-sm ${ratingFilter === rating ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setRatingFilter(rating)}
          >
            {rating === "All" ? "All Ratings" : `${rating}⭐`}
          </button>
        ))}
      </div>

      {/* Topic filter */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Consultation", "Treatment", "Vaccination", "Nutrition", "Screening"].map(topic => (
          <button
            key={topic}
            className={`btn btn-sm ${topicFilter === topic ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setTopicFilter(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <ul className="list-group">
        {filteredFeedback.map(item => (
          <li key={item.id} className="list-group-item">
            <strong>{item.farmer}</strong> — {item.rating}⭐ ({item.topic})
            <br />
            <em>"{item.comment}"</em>
            <br />
            <small className="text-muted">{item.date}</small>
          </li>
        ))}
        {filteredFeedback.length === 0 && (
          <li className="list-group-item text-muted">
            No feedback found for {ratingFilter}⭐ in {topicFilter}.
          </li>
        )}
      </ul>
    </DashboardSection>
  )
}
