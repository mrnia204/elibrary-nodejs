import { useState, useEffect } from "react";
import { get } from "@/lib/http";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Edit, Mail, MapPin, Phone, Trash2, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NewStudentForm from "@/components/forms/AddNewStudentForm";
import BulkUploadStudents from "./BulkUploadStudents";

interface Student {
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  grade: string;
  class: string;
  address: string;
}

interface DashboardStats {
  total_students: number;
  student_data: Student[];
}
// Grade colors for badges
const gradeColors: { [key: string]: string} = {
  "12": "bg-green-100 text-green-800 border-green-200",
  "11": "bg-blue-100 text-blue-800 border-blue-200",
  "10": "bg-red-100 text-red-800 border-red-200",
  "9": "bg-purple-100 text-purple-800 border-purple-200",
  "8": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "7": "bg-orange-100 text-orange-800 border-orange-200",
  "6": "bg-pink-100 text-pink-800 border-pink-200",
  "5": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "4": "bg-teal-100 text-teal-800 border-teal-200",
  "3": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "2": "bg-green-100 text-green-800 border-green-200",
  "1": "bg-green-100 text-green-800 border-green-200",
}

const StudentManagement = () => {
  const[stats, setStats]=useState<DashboardStats | null>(null);
  const[loading, setLoading]=useState(true);
  const[error, setError] = useState<string | null>(null);
  const[open, setOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  function addNewStudentHandler() {
    setOpen(true);
  }

  function editStudentHandler(student_id: string) {
    alert(`Edit student with ID: ${student_id}`)
  }

  function deleteStudentHandler(student_id: string) {
    if (confirm("Are you sure you want to delete this student?")) {
      //implement a delete function
    
      alert(`Delete student with Id: ${student_id}`)
    }
  }

   const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get('/admin/adminDashboard');

      if (response && response.success) {
        setStats(response.data);
      } else {
        setError("Failed to fetch student data");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-8"/>
          <Skeleton className="h-10 w-32"/>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48"/>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full"/>
              ))]}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
            <p className="text-muted-foreground">
              Manage all students in the system ({stats.total_students} total students)
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              className="bg-teal-600 hover:bg-teal-700 cursor-pointer"
              onClick={addNewStudentHandler}
            >
              <User className="w-4 h-4 mr-2" />
              Add Student
            </Button>

            <Button 
              variant="outline"
              onClick={() => setShowUpload(true)}
              className="ml-2 cursor-pointer"
            >
              Bulk Upload
            </Button>
          </div>
        </div>

        <NewStudentForm open={open} onClose={() => setOpen(false)} />
        {showUpload && (
          <BulkUploadStudents 
            onUploadComplete={() => { 
              setShowUpload(false); 
              fetchStats(); // refresh the student list
            }}
          />
        )}

        {/* Student Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.student_data.length > 0 ? (
                  stats.student_data.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <div className="font-medium">{student.full_name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {student.student_id}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{student.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary" 
                          className={gradeColors[student.grade] || "bg-gray-100 text-gray-800"}
                        >
                          Grade {student.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {student.class}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{student.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editStudentHandler(student.student_id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteStudentHandler(student.student_id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No students found. Add your first student to get started.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
 
export default StudentManagement;