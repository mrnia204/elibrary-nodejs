import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { 
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"; 
import { Input } from "../ui/input";
import { post, get } from "@/lib/http";
import { useAuth } from "@/contexts/AuthContext";


const formSchema = z.object({
  username: z.string().min(2, {message: "Username must be at least 2 characters"}),
  password: z.string().min(6, {message: "Password must be at least 6 characters."}),
});


const AdminLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: ""}
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setMessage(null);

    try {    
      // STEP 1: Authenticate using your /authenticate endpoint
      const authRes = await post("/authenticate", {
        username: values.username,
        password: values.password,
        role: "student", // This matches your backend expectation
      });

      console.log("Auth response:", authRes);

      if (!authRes?.success) {
        setMessage(authRes?.message || "Login failed");
        setLoading(false);
        return;
      }

      const user_id = authRes.user_id; // From your backend response

      // STEP 2. Fetch the student data. 
      const studentRes = await get("/getStudent", {user_id});
      if (!studentRes?.success) {
        setMessage("Failed to fetch student data");
        setLoading(false);
        return;
      }
      // this keeps all the student details
      const studentData = studentRes.data; 

      // STEP 3: Record login activity using your /log-activity endpoint
      const activityRes = await post("/log-activity", {
        user_id: user_id,
        action: "login",
        // Note: activity_id is not needed for login action in your backend
      });


      if (activityRes?.status === "success") {
        // STEP 4: Save user info and update auth context
        const userData = {
          username: values.username,
          role: "student" as const,
          user_id: user_id,
          full_name: studentData.full_name,
          activity_id: activityRes.activity_id, // From your backend insert
          login_time: new Date().toISOString(),
        };

        // Update auth context
        login({
          username: values.username,
          role: "student",
          user_id: user_id,
          activity_id: activityRes.activity_id,
          login_time: new Date().toISOString(),
        });

        // Also store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));

        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/student-dashboard"), 1000);
      } else {
        setMessage(activityRes?.message || "Failed to log activity");
      }
    } catch (error: unknown) {
      console.error("Login error", error);

      if (error instanceof Error) {
        const errMsg = error.message || "Connection error. Please try again";
        setMessage(errMsg);
      } else {
        setMessage("An unknown error occured. Please try again.");
      }
    }finally { 
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <p className="text-gray-600 text-xs">Enter your credentials to access the admin panel</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {message && (
            <div className={`p-3 rounded-md text-center text-sm font-medium ${
              message.includes("successful") 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}
          
          {/** Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <i className="ri-user-line"></i>
                    </span>
                    <Input
                      className="pl-10 pr-4 py-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter admin username"
                      {...field}
                      disabled={loading}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-xs" />
              </FormItem>
            )}
          />

          {/** Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <i className="ri-lock-line"></i>
                    </span>
                    <Input
                      type="password"
                      className="pl-10 pr-4 py-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your password"
                      {...field}
                      disabled={loading}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-xs" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="ri-login-box-line mr-2"></i>
                Sign in as Student
              </span>
            )}
          </Button>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AdminLoginForm;