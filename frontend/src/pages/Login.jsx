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

     navigate("/student/exams");



    } catch (err) {
      console.log(err);

      const message = err.response?.data?.message || "Login failed. Try again"
      setError(message)
    } finally{
      setLoading(false)
    }
  }
   
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-indigo-100 px-4">
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

      <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
        Welcome Back!
      </h2>
      <p className="text-center text-slate-500 mb-6">
        Login in to continue
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  </div>
);

}

export default Login
