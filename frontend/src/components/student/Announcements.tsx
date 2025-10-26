"use client"
import { useEffect, useState } from "react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Bell } from "lucide-react"
import axios from "axios"

interface Announcement {
  id: number
  title: string
  description: string
  priority: "high" | "medium" | "low"
  date: string
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("http://localhost/elibrary/backend/get_announcements.php")
        setAnnouncements(res.data)
      } catch (error) {
        console.error("Error fetching announcements:", error)
      }
    }
    fetchAnnouncements()
  }, [])

  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <Card key={a.id} className="bg-white p-6 shadow rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{a.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(a.priority)}`}>
                      {a.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{a.description}</p>
                  <p className="text-sm text-gray-500">{a.date}</p>
                </div>
                <Bell className="text-gray-400 w-5 h-5" />
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No announcements available.</p>
        )}
      </div>
    </div>
  )
}
