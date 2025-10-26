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
import { post } from "@/lib/http";
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

    // const formData = new FormData()
    // formData.append("username", values.username);
    // formData.append("password", values.password);
    // formData.append("role", "admin");



    try {    
      // STEP 1: Only authenticate first

      const authRes = await post("/authenticate", {
        username: values.username,
        password: values.password,
        role: "admin",
      });

      if (!authRes?.success) {
        setMessage(authRes?.message || "Login failed");
        setLoading(false);
        return;
      }

      const user_id = authRes.data?.user_id || authRes.user_id;

      // STEP 2: record login activity
      const activityRes = await post("/log-activity", {
        user_id,
        action: "login",
      });

      console.log("Acitivity log response", activityRes);

      if (activityRes?.success || activityRes?.status === "success") {
        // STEP 3: Save user info and activity_id and localstorage
        const userData = {
          username: values.username,
          role: "admin" as const,
          user_id: user_id,
          activity_id: activityRes.activity_id,
          loginTime: new Date().toISOString(),
        };

        // update auth context
        login( {
          username: values.username,
          role: "admin",
          user_id: user_id,
        });

        // also store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
        // localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     user_id: user_id,
        //     role: "admin",
        //     activity_id: activityRes.activity_id,
        //     username: values.username,
        //     loginTime: new Date().toISOString(),
        //   })
        // );

        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/admin-dashboard"), 1000);
      } else {
        setMessage(activityRes.message || "Failed to log activity");
    }
  } catch (error) {
    console.error("Login error", error);
    setMessage("Connection error. Please try again");
  } finally {
    setLoading(false);
  }
}

      

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/** username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
               <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                    <i className="ri-user-line"></i> |
                  </span>
                  <Input
                    className="pl-10 pr-4 py-3"
                    placeholder="Enter your admin username"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
               <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                    <i className="ri-lock-line"></i> |
                  </span>
                  <Input
                    className="pl-10 pr-4 py-3"
                    placeholder="Enter your passord"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Button & Message */}
        <Button
          type="submit"
          className="w-full bg-blue-600 rounded-full hover:bg-blue-800 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.startsWith("") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </Form>
  );
}
 
export default AdminLoginForm;