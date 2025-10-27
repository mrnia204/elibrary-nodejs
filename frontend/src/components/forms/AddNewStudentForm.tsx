import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { post } from "@/lib/http";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


const formSchema = z.object({
  student_id: z.string().min(3, { message: "Student ID must be at least 3 characters long"}),
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters long"}),
  email: z.string().email({ message: "Please enter a valid email address"}),
  phone: z.string().min(7, { message: "Phone number must be at least 7 characters long"}),
  grade: z.string().min(1, { message: "Grade is required"}),
  class: z.string().min(1, { message: "Class is required"}),
  address: z.string().min(10, { message: "Address must be at least 10 characters long"}),

  // credentiasl
  username: z.string().min(4, { message: "Username must be at least 4 characters long"}),
  password: z.string().min(6, { message: "Password must be at least 6 characters long"})
});

type FormSchema = z.infer<typeof formSchema>;

interface ApiResponse <T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

const NewStudentForm = ({ open, onClose}: { open: boolean; onClose: () => void}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: "",
      full_name: "",
      email: "",
      phone: "",
      grade: "",
      class: "",
      address: "",
      username: "",
      password: "",
    },
  });

  const onSubmitHandler = async(values: FormSchema) => {
    setLoading(true);
    setMessage(null);

    try {
      const res: ApiResponse = await post("/register-student", values);

      if (res && res.success) {
        setMessage(res.message || "Student added successfully!");
        form.reset();

        // close successful submission
        setTimeout(() => {
          onClose();
        }, 2000);
      }else {
        //handle case where res is undefined or success is false
        setMessage(res?.message || "Failed to add student. Please try again");
      }
    } catch (error) {
     console.error("Error adding student", error);
     
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6 mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Add New Student</DialogTitle>
          <DialogDescription>Fill in the details to add new student to the system</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(formSchema.shape) as (keyof FormSchema)[]).map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-medium">
                      {fieldName.replace(/_/g, " ").replace(/\b\w/g, (l)=> l.toUpperCase())}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type={fieldName === 'password' ? 'password' : 'text'}
                        placeholder={`Enter ${fieldName.replace(/_/g, "")}`}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>
            ))}

            {/** Button & Message */}
            <div className="sm:col-span-2 flex items-center justify-center pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-32 bg-blue-600 rounded-full hover:bg-blue-800 cursor-pointer"
              >
                {loading ? "Saving...": "Add Student"}
              </Button>
            </div>

            {message && (
              <div className="sm:col-span-2">
                <p 
                  className={`text-center text-sm ${
                    message.includes("successfully") ? "text-green-600" : "text-red-600"  
                  }`}
                >
                  {message}
                </p>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
 
export default NewStudentForm;