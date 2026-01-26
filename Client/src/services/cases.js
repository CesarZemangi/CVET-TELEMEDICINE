import api from "./api"

export async function getFarmerCases() {
  const response = await api.get("/farmer/cases")
  return response.data
}

export async function createCase(caseData) {
  const response = await api.post("/farmer/cases", caseData)
  return response.data
}

export async function getVetCases() {
  const response = await api.get("/vet/cases")
  return response.data
}

export async function updateCaseStatus(id, status) {
  const response = await api.patch(`/vet/cases/${id}`, {
    status
  })
  return response.data
}
