import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

type UserInfo = {
  id: string
  password: string
  fullName: string
  name: string
} | null

const LoginContext = createContext<{
  user: UserInfo
  setUser: (user: UserInfo) => void
  logout: () => void
}>({
  user: null,
  setUser: () => {},
  logout: () => {},
})

export function LoginProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserInfo>(null)

  const setUser = (user: UserInfo) => {
    if (user) {
      localStorage.setItem("userId", user.id)
      localStorage.setItem("password", user.password)
      localStorage.setItem("name", user.name)
      localStorage.setItem("fullName", user.fullName)
    } else {
      localStorage.removeItem("userId")
      localStorage.removeItem("password")
      localStorage.removeItem("name")
      localStorage.removeItem("fullName")
    }
    setUserState(user)
  }

  const logout = () => {
    setUser(null)
  }

  useEffect(() => {
    const id = localStorage.getItem("userId")
    const password = localStorage.getItem("password")
    const name = localStorage.getItem("name")
    const fullName = localStorage.getItem("fullName")
    if (id && password && name && fullName) {
      setUser({ id, password, name, fullName })
    }
  }, [])

  return (
    <LoginContext.Provider value={{ user, setUser, logout }}>
      {children}
    </LoginContext.Provider>
  )
}

export function useLogin() {
  return useContext(LoginContext)
}
