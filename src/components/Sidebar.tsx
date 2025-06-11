import { useNavigate, Link } from "react-router-dom"
import { useLogin } from "../context/LoginContext"

export default function Sidebar() {
  const { user, setUser } = useLogin()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    navigate("/")
  }

  const links = [
    { to: "/home", label: "ホーム", color: "bg-pink-200" },
    { to: "/trainingsearch", label: "研修検索", color: "bg-yellow-200" },
    { to: "/cancelrequest", label: "キャンセル / 欠席申請", color: "bg-green-200" },
    { to: "/closerequest", label: "不芳中止処理", color: "bg-blue-200" },
    { to: "/dummy2", label: "🚧", color: "bg-purple-200" },
    { to: "/dummy3", label: "🚧", color: "bg-orange-200" },
    { to: "/dummy4", label: "🚧", color: "bg-teal-200" },
    { to: "/dummy5", label: "🚧", color: "bg-rose-200" },
  ]

  return (
    <div className="w-60 bg-gray-100 min-h-screen border-r flex flex-col justify-between">
      <div className="flex flex-col">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`w-full px-4 py-3 font-bold text-left text-mid text-gray-600 ${link.color} transition-all duration-200 transform hover:translate-x-5 hover:shadow-md`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="relative group font-bold text-xs text-gray-600 px-4 py-3 bg-white">
        <span className="block">🔑 {user?.fullName} さん</span>
        <button
          onClick={handleLogout}
          className="absolute right-10 top-3 font-bold text-gray-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          🔒 Log out
        </button>
      </div>
    </div>
  )
}
