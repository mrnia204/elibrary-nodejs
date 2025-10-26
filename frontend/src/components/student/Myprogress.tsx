import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart,
  ComposedChart,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

type ProgressData = {
  month: string;
  hours: number;
  grade: number;
};

const data: ProgressData[] = [
  { month: "Jan", hours: 12, grade: 55 },
  { month: "Feb", hours: 18, grade: 65 },
  { month: "Mar", hours: 25, grade: 70 },
  { month: "Apr", hours: 35, grade: 80 },
  { month: "May", hours: 45, grade: 90 },
  { month: "Jun", hours: 28, grade: 75 },
  { month: "Jul", hours: 12, grade: 55 },
  { month: "Aug", hours: 18, grade: 65 },
  { month: "Sep", hours: 25, grade: 70 },
  { month: "Oct", hours: 35, grade: 80 },
  { month: "Nov", hours: 45, grade: 90 },
  { month: "Dec", hours: 28, grade: 75 },
];


const MyProgress = () => {
  return (
     <Card className="bg-white rounded-lg shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Monthly Progress
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" name="Hours" fill="#14B8A6" barSize={40} />
              <Line
                type="monotone"
                dataKey="grade"
                name="Grade"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
 
export default MyProgress;