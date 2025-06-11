import { useState } from "react"
import { useLogin } from "@/context/LoginContext"
import { ENDPOINTS } from "@/api/endpoints"

export default function CloseRequest() {
  const { user } = useLogin()
  const [webIdsText, setWebIdsText] = useState("")
  const [capacitiesText, setCapacitiesText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ count: number; csv_path: string } | null>(null)
  const [error, setError] = useState("")

  const parseUpdates = () => {
    const webIds = webIdsText.split("\n").map(line => line.trim()).filter(Boolean)
    const capacities = capacitiesText.split("\n").map(line => line.trim()).filter(Boolean)

    if (webIds.length === 0 || capacities.length === 0) {
      setError("Web連携IDと受講者数を両方入力してください")
      return null
    }

    if (webIds.length !== capacities.length) {
      setError(`行数が一致していません（ID: ${webIds.length}行, 受講者数: ${capacities.length}行）`)
      return null
    }

    return webIds.map((web_id, i) => ({
      web_id,
      capacity: parseInt(capacities[i], 10) || 0
    }))
  }

  const handleSubmit = async () => {
    if (!user) {
      setError("ログイン情報が見つかりません")
      return
    }

    const updates = parseUpdates()
    if (!updates) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(ENDPOINTS.closeRequest.prepare, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: user.id,
          password: user.password,
          name: user.name,
          updates
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || "送信失敗")
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleScrape = async () => {
    if (!user) {
      setError("ログイン情報が見つかりません")
      return
    }

    const updates = parseUpdates()
    if (!updates) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(ENDPOINTS.closeRequest.scrape, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: user.id,
          password: user.password,
          name: user.name,
          updates
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || "送信失敗")
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6">不芳中止処理</h2>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block mb-2 font-medium">Web連携ID（1行1件）</label>
          <textarea
            rows={10}
            value={webIdsText}
            onChange={(e) => setWebIdsText(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder={`440661\n440663\n440665`}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">受講者数（1行1件）</label>
          <textarea
            rows={10}
            value={capacitiesText}
            onChange={(e) => setCapacitiesText(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder={`12\n8\n10`}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "送信中..." : "受付停止実行"}
        </button>

        <button
          onClick={handleScrape}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "送信中..." : "実受講者数取得"}
        </button>
      </div>

      {result && (
        <div className="mt-4 text-green-700">
          ✅ {result.count} 件を更新しました。<br />
          CSV: <code>{result.csv_path}</code>
        </div>
      )}

      {error && <div className="mt-4 text-red-600 whitespace-pre-wrap">⚠️ {error}</div>}
    </div>
  )
}
