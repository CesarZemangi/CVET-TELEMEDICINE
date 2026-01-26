import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function MessageBox() {
const [message, setMessage] = useState("")

return (
<div className="border rounded-md p-4 space-y-2">
<div className="h-40 overflow-y-auto bg-gray-50 p-2 text-sm">
No messages yet
</div>
  <div className="flex gap-2">
    <Input
      value={message}
      onChange={e => setMessage(e.target.value)}
      placeholder="Type message"
    />
    <Button>
      Send
    </Button>
  </div>
</div>
)}
