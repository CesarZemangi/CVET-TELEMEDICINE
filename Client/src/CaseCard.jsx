import { Card, CardContent } from "../components/ui/card"

export default function CaseCard() {
return (
<Card className="mb-2">
<CardContent className="p-4">
<p className="font-medium">Cow not eating</p>
<p className="text-sm text-gray-500">Status. Waiting for vet</p>
</CardContent>
</Card>
)
}