import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      //sending data
      const response = await api.post("/auth/login",{
        email,
        password
      })

      //backend call login steps

      // extracting backend data
       const { user, accessToken } = response.data.data
      

      console.log("Logged in user:", user)
      console.log("Access token:", accessToken)

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("user", JSON.stringify(user))

      navigate("/student/exams")



    } catch (err) {
      console.log(err);

      const message = err.response?.data?.message || "Login failed. Try again"
      setError(message)
    } finally{
      setLoading(false)
    }
  }
   
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
