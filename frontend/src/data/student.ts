export const studentData = [
  {title: "Student ID", content: "ST001", iconbgcolor: "bg-blue-100", icon: "ri-user-line text-blue-600"},
  {title: "Total Hours", content: "45hrs", iconbgcolor: "bg-green-100", icon: "ri-time-line text-green-600"},
  {title: "Current Grade", content: "Three (3)", iconbgcolor: "bg-yellow-100", icon: "ri-trophy-line text-yellow-600"},
  {title: "Class", content: "3B", iconbgcolor: "bg-purple-100", icon: "ri-medal-line text-purple-600"},
];

type ActiveData = {
  name: string;
  value: number;
  color: string;
}

export const data: ActiveData[] = [
  { name: "Reading", value: 35, color: "#14B8A6" },
  { name: "Research", value: 25, color: "#F59E0B" },
  { name: "Assignments", value: 20, color: "#EF4444" },
  { name: "Projects", value: 15, color: "#8B5CF6" },
  { name: "Other", value: 5, color: "#06B6D4" },
];

type Event = {
  title: string;
  date: string; // You can also use Date type if parsing
  color: string; // Tailwind color class for the dot
};

export const events: Event[] = [
  {title: "Mathematics Quiz", date: "2025-10-15", color: "bg-red-500" },
  {title: "Science Project Due", date: "2025-11-18", color: "bg-yellow-500" },
  {title: "In dependance 50 years", date: "2025-09-16", color: "bg-blue-500" },
  {title: "English Essay Submission", date: "2025-11-22", color: "bg-yellow-500" },
  {title: "Holiay xmas", date: "2025-12-25", color: "bg-green-500" },
];


export const quickActions = [
  { title: "Access eLibrary", content: "Browse digital resources", icon: "ri-book-open text-teal-600", bgClass: "bg-teal-50 hover:bg-teal-100", link: "#calendar"},
  { title: "View Shedule", content: "Check your Timetable", icon: "ri-calendar-check-open text-blue-600", bgClass: "bg-blue-50 hover:bg-blue-100", link: "#calendar"},
  { title: "Check Announcements", content: "Stay up to date", icon: "ri-file-text-line text-purple-600", bgClass: "bg-purple-50 hover:bg-purple-100",link: "#calendar"},
];