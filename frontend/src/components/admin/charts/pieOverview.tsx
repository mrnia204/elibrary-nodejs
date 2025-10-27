import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, PieChart, Pie, ResponsiveContainer, Tooltip,  } from "recharts";
import type {PieLabelRenderProps} from 'recharts';
import { motion } from 'framer-motion';



type TimeRow = {
  grade: string | number;
  class: string | number;
  total_time_spent: number; // numeric value return from backend
}

type Props = {
  data: TimeRow[];
  height?: number;
}

const COLORS = [
  "#60A5FA",
  "#34D399",
  "#F59E0B",
  "#F87171",
  "#A78BFA",
  "#FB7185",
  "#38BDF8",
  "#FBBF24",
];

function formatTime(msOriUnits: number) {
  if (msOriUnits >= 3600) {
    const h = Math.floor(msOriUnits / 3600);
    const m = Math.floor((msOriUnits % 3600) / 60);
    return `${h}h ${m}m`;
  }

  if (msOriUnits >= 60) {
    const m = Math.floor(msOriUnits / 60);
    const s = msOriUnits % 60;
    return `${m}m ${s}s`;
  }

  return `${msOriUnits}`;
}


const TimeSpentPieChart = ({ data =[], height = 500}: Props) => {
  const chartData = data.map((r) =>({
    name: `${r.grade}-${r.class}`,
    value: Number(r.total_time_spent) || 0,
    raw: r,
  }));

  const total = chartData.reduce((s, c) => s + c.value, 0) || 1;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Time Spent by Grade & Class for (7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: 400, width: 400, minWidth: 0, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={Math.min(120, height / 2 - 10)}
                fill="#8884d8"
                label={(props: PieLabelRenderProps) => {
                  const { name, percent} = props;
                  const pct = Number(percent) || 0; // cast to number
                  return `${name}: ${Math.round(pct * 100)}%`;
                } }
                isAnimationActive={true}
              > 
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip 
                formatter={(value, _name, props) => {
                  // value is numeric (time). Show human readable and raw number
                  return [formatTime(Number(value)), `${props.payload.name}`];
                }}
              />

              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => {
                  // Show name and percent in legend
                  const found = chartData.find((d) => d.name === value);
                  const pct = found ? Math.round((found.value / total) * 100) : 0;
                  return `${value} (${pct} %)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/** Framermotion */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          Total time: <strong>{formatTime(total)}</strong>
        </motion.div>
      </CardContent>
    </Card>
  );
}
 
export default TimeSpentPieChart;