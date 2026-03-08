import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "../utils/axiosConfig";
import useAuthStore from "../store/useAuthStore";

export default function AuthModal({ type, closeModal }) {
  const isSignup = type === "signup";
  const { login: setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

const signup = async (data) => {
  try {
    const res = await axios.post("/api/user/register", data, { withCredentials: true })
    setUser(res.data.data.user)  // ✅ was res.data.data
      const loginRes = await axios.post("/api/user/login", {
      email: data.email,
      password: data.password
    }, { withCredentials: true })
    closeModal()
  } catch (error) {
    console.log(error.response?.data?.message || "Signup failed")
  }
}

const login = async (data) => {
  try {
    const res = await axios.post("/api/user/login", data, { withCredentials: true })
    setUser(res.data.data.user)  // ✅ was res.data.data
    closeModal()
  } catch (error) {
    console.log(error.response?.data?.message || "Login failed")
  }
}

  const onSubmit = (data) => {
    if (isSignup) {
      signup(data)  // 👈 call signup if type is signup
    } else {
      login(data)   // 👈 call login if type is login
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md relative">

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h3>
          <p className="mt-1 text-center text-gray-500">
            {isSignup ? "Signup to continue" : "Login to your account"}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">

            {/* Username (Signup only) */}
            {isSignup && (
              <div>
                <input
                  {...register("username", {
                    required: "Username is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                  autoComplete="username"
                  className="block w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  type="text"
                  placeholder="Username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                )}
              </div>
            )}

            {/* Phone (Signup only) */}
            {isSignup && (
              <div>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: { value: /^[0-9]{10,11}$/, message: "Invalid phone number" },
                  })}
                  autoComplete="tel"
                  className="block w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  type="tel"
                  placeholder="Phone Number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/, message: "Invalid email address" },
                })}
                autoComplete="email"
                className="block w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                type="email"
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="block w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password (Login only) */}
            {!isSignup && (
              <div className="text-right">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>

          </form>
        </div>

        <div className="flex items-center justify-center py-4 bg-gray-50">
          {isSignup ? (
            <span className="text-sm text-gray-600">Already have an account?</span>
          ) : (
            <span className="text-sm text-gray-600">Don't have an account?</span>
          )}
        </div>

      </div>
    </div>
  );
}