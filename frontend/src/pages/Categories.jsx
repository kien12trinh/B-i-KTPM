import { useState, useEffect, useCallback } from 'react'
import { categoryApi, savingsApi } from '../api/client'
import GoalModal from '../components/savings/GoalModal'
import DepositModal from '../components/savings/DepositModal'

function formatVnd(n) {
  return Number(n).toLocaleString('vi-VN') + ' ₫'
}

// ── Category row ──────────────────────────────────────────────────
function CategoryRow({ cat, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#eff4ff] transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#006948]/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[#006948]">{cat.icon}</span>
        </div>
        <div>
          <p className="text-body-lg font-semibold text-[#0b1c30]">{cat.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onDelete(cat.id)} className="p-2 hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded-full text-[#3d4a42]">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  )
}

// ── Savings goal card ─────────────────────────────────────────────
function SavingsCard({ goal, onDeposit, onEdit, onDelete }) {
  const pct = goal.progress_pct ?? Math.round((goal.saved_amount / goal.target_amount) * 100)
  const isCompleted = goal.is_completed ?? pct >= 100

  return (
    <div className={`bg-white p-6 rounded-xl border shadow-[0px_4px_20px_rgba(30,41,59,0.05)] flex flex-col gap-3 relative overflow-hidden
      ${isCompleted ? 'border-[#006948]/40' : 'border-[#bccac0]'}`}
    >
      <div className="absolute top-3 right-3 flex items-center gap-1">
        {isCompleted && (
          <span className="material-symbols-outlined icon-filled text-[#006948] text-[20px]">check_circle</span>
        )}
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          isCompleted ? 'bg-[#006948] text-white' : pct >= 75 ? 'bg-[#d97706] text-white' : 'bg-[#dce9ff] text-[#006948]'
        }`}>
          {pct}%
        </span>
      </div>

      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isCompleted ? 'bg-[#006948]/10 text-[#006948]' : 'bg-[#dce9ff] text-[#006948]'
        }`}>
          <span className="material-symbols-outlined text-[28px]">{goal.icon}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(goal)} className="p-1.5 hover:bg-[#dce9ff] rounded-full text-[#3d4a42]">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button onClick={() => onDelete(goal.id)} className="p-1.5 hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded-full text-[#3d4a42]">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-title-sm text-[#0b1c30]">{goal.name}</h4>
        {goal.deadline && (
          <p className="text-body-md text-[#3d4a42]">Deadline: {new Date(goal.deadline).toLocaleDateString('vi-VN')}</p>
        )}
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-number-xl text-[#006948]">
            {formatVnd(goal.target_amount)}
          </span>
          <span className="text-body-md text-[#3d4a42]">đã có {formatVnd(goal.saved_amount)}</span>
        </div>
        <div className="w-full h-2 bg-[#d3e4fe] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#006948] to-[#85f8c4] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-label-caps text-[#3d4a42]">
          <span>Còn lại: {formatVnd(goal.remaining_amount ?? goal.target_amount - goal.saved_amount)}</span>
          <span>Mục tiêu: {formatVnd(goal.target_amount)}</span>
        </div>
      </div>

      {!isCompleted && (
        <button
          onClick={() => onDeposit(goal)}
          className="w-full mt-1 py-2 bg-[#006948] text-white rounded-lg text-label-caps hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nạp tiền
        </button>
      )}
      {isCompleted && (
        <div className="w-full mt-1 py-2 bg-[#006948]/10 text-[#006948] rounded-lg text-label-caps text-center font-semibold">
          Đã hoàn thành 🎉
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────
export default function Categories() {
  const [incomeCats, setIncomeCats]   = useState([])
  const [expenseCats, setExpenseCats] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)

  const [goals, setGoals]             = useState([])
  const [loadingGoals, setLoadingGoals] = useState(true)

  const [goalModal, setGoalModal]       = useState({ open: false, goal: null })
  const [depositModal, setDepositModal] = useState({ open: false, goal: null })

  // ── Fetch categories ──────────────────────────────────────────
  useEffect(() => {
    categoryApi.getAll()
      .then((r) => {
        const cats = r.data.data || []
        setIncomeCats(cats.filter((c) => c.type === 'income'))
        setExpenseCats(cats.filter((c) => c.type === 'expense'))
      })
      .catch(console.error)
      .finally(() => setLoadingCats(false))
  }, [])

  // ── Fetch goals ───────────────────────────────────────────────
  const fetchGoals = useCallback(async () => {
    try {
      const res = await savingsApi.getAll()
      setGoals(res.data.data)
    } catch {
      // backend not ready
    } finally {
      setLoadingGoals(false)
    }
  }, [])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  // ── Goal handlers ─────────────────────────────────────────────
  const handleCreateGoal = async (data) => {
    const res = await savingsApi.create(data)
    setGoals((prev) => [res.data.data, ...prev])
  }

  const handleUpdateGoal = async (data) => {
    const res = await savingsApi.update(goalModal.goal.id, data)
    setGoals((prev) => prev.map((g) => g.id === goalModal.goal.id ? res.data.data : g))
  }

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Xoá mục tiêu này? Tất cả lần nạp sẽ bị xoá theo.')) return
    await savingsApi.delete(id)
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  // ── Deposit handler ───────────────────────────────────────────
  const handleDeposit = async (data) => {
    const res = await savingsApi.addDeposit(depositModal.goal.id, data)
    setGoals((prev) => prev.map((g) => g.id === depositModal.goal.id ? res.data.data.goal : g))
  }

  // ── Category delete handler ───────────────────────────────────
  const handleDeleteCat = async (id) => {
    if (!window.confirm('Xoá danh mục này?')) return
    try {
      await categoryApi.delete(id)
      setIncomeCats((c) => c.filter((x) => x.id !== id))
      setExpenseCats((c) => c.filter((x) => x.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Không thể xoá danh mục này')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* ── Section 1: Categories ─────────────────────────────── */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-display-lg text-[#0b1c30] mb-2">Quản lý Danh mục</h1>
            <p className="text-body-lg text-[#3d4a42] max-w-xl">
              Tổ chức tài chính bằng cách phân loại các khoản thu nhập và chi tiêu.
            </p>
          </div>
        </div>

        {loadingCats ? (
          <div className="text-center py-8 text-[#3d4a42]">Đang tải danh mục...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-[#bccac0] shadow-[0px_4px_20px_rgba(30,41,59,0.05)]">
              <div className="flex items-center justify-between mb-4 border-b border-[#bccac0] pb-3">
                <h3 className="text-title-sm text-[#006948] flex items-center gap-2">
                  <span className="material-symbols-outlined">trending_up</span>
                  Danh mục Thu nhập
                </h3>
                <span className="bg-[#006948]/10 text-[#006948] px-2 py-1 rounded text-label-caps">
                  {incomeCats.length} danh mục
                </span>
              </div>
              <div className="space-y-1">
                {incomeCats.map((cat) => (
                  <CategoryRow key={cat.id} cat={cat} onDelete={handleDeleteCat} />
                ))}
                {incomeCats.length === 0 && (
                  <p className="text-body-md text-[#6d7a72] py-2">Chưa có danh mục thu nhập</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#bccac0] shadow-[0px_4px_20px_rgba(30,41,59,0.05)]">
              <div className="flex items-center justify-between mb-4 border-b border-[#bccac0] pb-3">
                <h3 className="text-title-sm text-[#9b3e3b] flex items-center gap-2">
                  <span className="material-symbols-outlined">trending_down</span>
                  Danh mục Chi tiêu
                </h3>
                <span className="bg-[#ffdad6]/40 text-[#9b3e3b] px-2 py-1 rounded text-label-caps">
                  {expenseCats.length} danh mục
                </span>
              </div>
              <div className="space-y-1">
                {expenseCats.map((cat) => (
                  <CategoryRow key={cat.id} cat={cat} onDelete={handleDeleteCat} />
                ))}
                {expenseCats.length === 0 && (
                  <p className="text-body-md text-[#6d7a72] py-2">Chưa có danh mục chi tiêu</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Section 2: Saving Goals ───────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-headline-md text-[#0b1c30]">Mục tiêu Tiết kiệm</h2>
            <p className="text-body-md text-[#3d4a42] italic">Cùng hiện thực hóa những giấc mơ của bạn</p>
          </div>
          <button
            onClick={() => setGoalModal({ open: true, goal: null })}
            className="flex items-center gap-2 bg-[#006948] text-white px-5 py-2.5 rounded-full font-bold shadow hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Tạo mục tiêu
          </button>
        </div>

        {loadingGoals ? (
          <div className="text-center py-12 text-[#3d4a42]">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#006948]">progress_activity</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {goals.map((g) => (
              <div key={g.id} className="group">
                <SavingsCard
                  goal={g}
                  onDeposit={(goal) => setDepositModal({ open: true, goal })}
                  onEdit={(goal) => setGoalModal({ open: true, goal })}
                  onDelete={handleDeleteGoal}
                />
              </div>
            ))}

            {goals.length === 0 && (
              <div
                onClick={() => setGoalModal({ open: true, goal: null })}
                className="bg-[#213145] text-[#eaf1ff] p-6 rounded-xl border border-[#6d7a72] flex flex-col justify-center items-center gap-4 text-center cursor-pointer hover:border-[#006948] transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-[#006948] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[40px] text-white">add_circle</span>
                </div>
                <div>
                  <h4 className="text-headline-md mb-1">Tạo mục tiêu đầu tiên</h4>
                  <p className="text-body-md opacity-70">Bắt đầu hành trình tiết kiệm của bạn ngay hôm nay.</p>
                </div>
              </div>
            )}

            {goals.length > 0 && (
              <div
                onClick={() => setGoalModal({ open: true, goal: null })}
                className="border-2 border-dashed border-[#bccac0] rounded-xl flex flex-col items-center justify-center gap-2 p-6 text-center cursor-pointer hover:border-[#006948] hover:bg-[#006948]/5 transition-all min-h-[200px]"
              >
                <span className="material-symbols-outlined text-[#006948] text-4xl">add_circle</span>
                <p className="text-body-md text-[#3d4a42] font-semibold">Thêm mục tiêu mới</p>
              </div>
            )}
          </div>
        )}

        {goals.length > 0 && (() => {
          const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0)
          const totalSaved  = goals.reduce((s, g) => s + g.saved_amount, 0)
          const overallPct  = totalTarget > 0 ? Math.round(totalSaved / totalTarget * 100) : 0
          const completed   = goals.filter((g) => g.is_completed).length
          return (
            <div className="mt-6 bg-[#d3e4fe]/30 rounded-2xl p-6 border border-[#bccac0] flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 space-y-3">
                <h3 className="text-headline-md text-[#0b1c30]">Tình trạng Tiết kiệm</h3>
                <p className="text-body-lg text-[#3d4a42]">
                  Bạn đang thực hiện <span className="text-[#006948] font-bold">{goals.length}</span> mục tiêu,
                  đã hoàn thành <span className="text-[#006948] font-bold">{completed}</span> mục tiêu.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white p-4 rounded-xl flex-1 border border-[#bccac0]">
                    <p className="text-label-caps text-[#3d4a42] mb-1">TỔNG ĐÃ TÍCH LŨY</p>
                    <p className="text-title-sm text-[#006948] font-bold">{formatVnd(totalSaved)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl flex-1 border border-[#bccac0]">
                    <p className="text-label-caps text-[#3d4a42] mb-1">CÒN CẦN THÊM</p>
                    <p className="text-title-sm text-[#0b1c30] font-bold">{formatVnd(totalTarget - totalSaved)}</p>
                  </div>
                </div>
              </div>
              <div className="w-40 h-40 relative flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="68" fill="transparent" stroke="#bccac0" strokeWidth="10" strokeOpacity="0.3" />
                  <circle
                    cx="80" cy="80" r="68" fill="transparent"
                    stroke="#006948" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 68}`}
                    strokeDashoffset={`${2 * Math.PI * 68 * (1 - overallPct / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] font-bold text-[#0b1c30]">{overallPct}%</span>
                  <span className="text-label-caps text-[#3d4a42]">TỔNG THỂ</span>
                </div>
              </div>
            </div>
          )
        })()}
      </section>

      {/* ── Modals ────────────────────────────────────────────── */}
      <GoalModal
        open={goalModal.open}
        goal={goalModal.goal}
        onClose={() => setGoalModal({ open: false, goal: null })}
        onSave={goalModal.goal ? handleUpdateGoal : handleCreateGoal}
      />
      <DepositModal
        open={depositModal.open}
        goal={depositModal.goal}
        onClose={() => setDepositModal({ open: false, goal: null })}
        onDeposit={handleDeposit}
      />
    </div>
  )
}
