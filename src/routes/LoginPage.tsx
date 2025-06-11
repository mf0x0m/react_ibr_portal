import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ENDPOINTS } from "@/api/endpoints"

export default function LoginPage({
  onLogin,
}: {
  onLogin: (user: {
    id: string
    password: string
    name: string
    fullName: string
  }) => void
}) {
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(ENDPOINTS.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loginId, password }),
      })
      const data = await res.json()
      if (data.success) {
        onLogin({
          id: loginId,
          password,
          fullName: data.fullName,
          name: data.fullName.split(" ")[0],
        })
        navigate("/home")
      } else {
        setError(data.error || "ログイン失敗")
        setShake(true)
        setTimeout(() => setShake(false), 300)
      }
    } catch (e) {
      setError("ネットワークエラー")
      setShake(true)
      setTimeout(() => setShake(false), 300)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <div className="w-full flex justify-center mt-20">
      <form onSubmit={handleSubmit} className="w-[200px]">
        <h2 className="text-xl mb-6 text-center font-bold animate-bounce">
          IBR Portal Login
        </h2>

        <input
          autoFocus
          className="border p-2 w-full mb-3 rounded"
          placeholder="WEBinsourceのログインID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="WEBinsourceのパスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50 ${
            shake ? "animate-shake" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </form>
    </div>
  )
}
