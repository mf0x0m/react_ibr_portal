import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useLogin } from "@/context/LoginContext";
import { ENDPOINTS } from "@/api/endpoints"

export default function FormPage() {
  const { user } = useLogin();

  const [webId, setWebId] = useState("");
  const [traineeName, setTraineeName] = useState("");
  const [status, setStatus] = useState("cancel");
  const [reason, setReason] = useState("1");
  const [payment, setPayment] = useState("1");
  const [transfer, setTransfer] = useState("1");
  const [mail, setMail] = useState("1");
  const [comment, setComment] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
    setLoadingConfirm(true);
    try {
      const res = await fetch(ENDPOINTS.cancelRequest.confirm, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: user?.id,
          password: user?.password,
          web_id: webId,
          trainee_name: traineeName,
          status,
          reason,
          payment,
          transfer,
          mail,
          comment,
        }),
      });
      if (!res.ok) throw new Error("確認情報の取得に失敗しました");
      setLoadingConfirm(false);
    } catch (err: any) {
      setLoadingConfirm(false);
      setSubmitError(err.message);
    }
  };

  const handleConfirm = async () => {
    try {
      const res = await fetch(ENDPOINTS.cancelRequest.submit, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: user?.id,
          password: user?.password,
          web_id: webId,
          trainee_name: traineeName,
          status,
          reason,
          payment,
          transfer,
          mail,
          comment,
        }),
      });
      if (!res.ok) throw new Error("申請に失敗しました");
      setShowConfirm(false);
      setShowResult(true);
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold">研修申請フォーム</h1>
        <div>
          <label className="block font-semibold">Web連携ID</label>
          <input value={webId} onChange={e => setWebId(e.target.value)} className="border p-2 w-full" required />
        </div>
        <div>
          <label className="block font-semibold">受講者名</label>
          <input value={traineeName} onChange={e => setTraineeName(e.target.value)} className="border p-2 w-full" required />
        </div>
        <div>
          <label className="block font-semibold">ステータス</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 w-full">
            <option value="cancel">キャンセル</option>
            <option value="absent">欠席</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">理由</label>
          <select value={reason} onChange={e => setReason(e.target.value)} className="border p-2 w-full">
            <option value="1">先方都合</option>
            <option value="2">不芳中止</option>
            <option value="3">当方都合</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">支払い</label>
          <select value={payment} onChange={e => setPayment(e.target.value)} className="border p-2 w-full">
            <option value="1">無</option>
            <option value="2">有</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">振替</label>
          <select value={transfer} onChange={e => setTransfer(e.target.value)} className="border p-2 w-full">
            <option value="1">無</option>
            <option value="2">有</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">メール送信</label>
          <select value={mail} onChange={e => setMail(e.target.value)} className="border p-2 w-full">
            <option value="1">送信する</option>
            <option value="2">送信しない</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">コメント</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} className="border p-2 w-full" required />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">確認</button>
      </form>

      {/* 確認モーダル */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">入力内容の確認</h2>
            {loadingConfirm ? (
              <p>確認情報を取得中...</p>
            ) : (
              <div className="space-y-2">
                <p><strong>研修ID:</strong> {webId}</p>
                <p><strong>受講者名:</strong> {traineeName}</p>
                <p><strong>ステータス:</strong> {status}</p>
                <p><strong>理由:</strong> {reason}</p>
                <p><strong>支払い:</strong> {payment}</p>
                <p><strong>振替:</strong> {transfer}</p>
                <p><strong>メール送信:</strong> {mail}</p>
                <p><strong>コメント:</strong> {comment}</p>
                <div className="flex justify-end space-x-2 pt-4">
                  <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-300">戻る</button>
                  <button onClick={handleConfirm} className="px-4 py-2 bg-green-500 text-white">確定</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>

      {/* 完了モーダル */}
      <Dialog open={showResult} onClose={() => setShowResult(false)} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold text-green-600">申請が完了しました</h2>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowResult(false)} className="px-4 py-2 bg-blue-500 text-white">閉じる</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* エラーメッセージ */}
      {submitError && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 border rounded">
          {submitError}
        </div>
      )}
    </>
  );
}
