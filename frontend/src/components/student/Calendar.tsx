import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DynCalendar from "./dynamicCalendar";
import { events } from "@/data/student";


const Calendar = () => { 

  return (
    <div className="wrapper py-8" id="calendor">
      <h2 className="text-xl font-semibold text-gray-900">Calendor</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/** Calendar */}
        <DynCalendar />
        {/** Upcoming events */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {events.map((e, i) =>(
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-900">{e.title}</p>
                <p className="text-xs text-gray-600">{e.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>

  
  );
}
 
export default Calendar;