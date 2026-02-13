"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "@/lib/auth-client"
import { Send } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  createdAt: string
  isRead: number
}

interface MessageThreadProps {
  bookingId: string
}

export default function MessageThread({ bookingId }: MessageThreadProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    // Poll for new messages every 10s
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [bookingId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  async function fetchMessages() {
    const res = await fetch(`/api/bookings/${bookingId}/messages`)
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return
    setSending(true)

    const res = await fetch(`/api/bookings/${bookingId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    })

    if (res.ok) {
      const msg = await res.json()
      setMessages((prev) => [...prev, msg])
      setInput("")
    }
    setSending(false)
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Messages area */}
      <div ref={scrollRef} className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucun message. Commencez la conversation.
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === session?.user.id
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                  isMe ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}>
                  {!isMe && (
                    <p className="text-xs font-medium mb-0.5 opacity-70">{msg.senderName}</p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ecrire un message..."
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
