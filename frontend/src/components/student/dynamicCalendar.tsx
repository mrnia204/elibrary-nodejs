import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { days } from "@/data/date";
import { events } from "@/data/student";


export default function Calendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // first and last days of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // pad start with empty cells for alignment
  const startDay = firstDayOfMonth.getDay();

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const generateDays = () => {
    const daysArray = [];

    // add empty slots for days before month start
    for (let i = 0; i < startDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      const eventForDay = events.find((e) => e.date === dateStr);
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      daysArray.push(
        <div
          key={day}
          className={`p-2 text-center text-sm cursor-pointer rounded hover:bg-gray-100 transition ${
            isToday ? "bg-teal-100 text-teal-800 font-semibold" : ""
          } ${eventForDay ? `${eventForDay.color} font-semibold` : ""}`}
        >
          {day}
        </div>
      );
    }

    return daysArray;
  };

  return (
      <Card className="bg-white rounded-lg shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {monthName} {year}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="rounded"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">{generateDays()}</div>
        </CardContent>
      </Card>
   
  );
}
