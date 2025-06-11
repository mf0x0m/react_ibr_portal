import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"
import type { JSX } from "react"
import LoginPage from "./routes/LoginPage"
import { LoginProvider, useLogin } from "./context/LoginContext"

import Sidebar from "./components/Sidebar"
import Home from "./routes/Home"
import TrainingSearch from "./routes/TrainingSearch"
import CancelRequest from "./routes/CancelRequest"
import CloseRequest from "./routes/CloseRequest"

// 💡 固定サイドバー付きレイアウト
function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { user } = useLogin()
  const location = useLocation()
  const isLoginPage = location.pathname === "/"

  return (
    <div className="h-screen flex overflow-hidden">
      {/* 左に固定されたサイドバー（ログイン済＆ログインページでないとき） */}
      {user && !isLoginPage && (
        <div className="w-60 fixed top-0 left-0 h-screen z-10">
          <Sidebar />
        </div>
      )}

      {/* メイン画面は60px押し出してスクロール可能 */}
      <div
        className={`flex-1 overflow-auto p-4 ${
          user && !isLoginPage ? "ml-60" : ""
        }`}
      >
        {children}
      </div>
    </div>
  )
}

// 🔐 認証が必要なページ
function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useLogin()
  return user ? children : <Navigate to="/" replace />
}

// 📦 全ルーティング
function AppRoutes() {
  const { user, setUser } = useLogin()

  return (
    <LayoutWithSidebar>
      <Routes>
        {/* ルートアクセス時：ログイン済なら /home にリダイレクト */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginPage onLogin={setUser} />
            )
          }
        />

        {/* 各ページに認証を要求 */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/trainingsearch"
          element={
            <RequireAuth>
              <TrainingSearch />
            </RequireAuth>
          }
        />
        <Route
          path="/cancelrequest"
          element={
            <RequireAuth>
              <CancelRequest />
            </RequireAuth>
          }
        />
        <Route
          path="/closerequest"
          element={
            <RequireAuth>
              <CloseRequest />
            </RequireAuth>
          }
        />
      </Routes>
    </LayoutWithSidebar>
  )
}

// 🔧 アプリ全体
export default function App() {
  return (
    <LoginProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LoginProvider>
  )
}
