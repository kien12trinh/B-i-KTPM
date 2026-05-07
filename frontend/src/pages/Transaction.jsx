import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { transactionApi, categoryApi } from '../api/client'

export default function Transaction() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [txType, setTxType]               = useState('expense')
  const [amount, setAmount]               = useState('')
  const [date, setDate]                   = useState(new Date().toISOString().split('T')[0])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [notes, setNotes]                 = useState('')
  const [previewImage, setPreviewImage]   = useState(null)
  const [submitting, setSubmitting]       = useState(false)
  const [error, setError]                 = useState('')

  const [allCategories, setAllCategories] = useState([])

  useEffect(() => {
    categoryApi.getAll()
      .then((r) => setAllCategories(r.data.data || []))
      .catch(console.error)
  }, [])

  const categories = allCategories.filter((c) => c.type === txType)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreviewImage(URL.createObjectURL(file))
  }

  const handleClear = () => {
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
    setSelectedCategory(null)
    setNotes('')
    setPreviewImage(null)
    setError('')
  }

  const handleSubmit = async () => {
    if (!amount || !selectedCategory) return
    setSubmitting(true)
    setError('')
    try {
      await transactionApi.create({
        type: txType,
        amount: Number(amount),
        date,
        category_id: selectedCategory,
        note: notes,
      })
      navigate('/analytics')
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi lưu giao dịch')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 pb-32">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-display-lg text-[#0b1c30]">
          {txType === 'expense' ? 'Nhập Giao Dịch Mới' : 'Nhập Thu Nhập Mới'}
        </h1>
        <p className="text-body-lg text-[#3d4a42] mt-1">
          Ghi lại các khoản chi tiêu hoặc thu nhập để theo dõi dòng tiền của bạn.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-7 space-y-4">

          {/* Transaction Type Toggle */}
          <div className="bg-white custom-shadow rounded-xl p-4 border border-[#bccac0]">
            <label className="text-label-caps text-[#3d4a42] block mb-3">LOẠI GIAO DỊCH</label>
            <div className="flex p-1 bg-[#dce9ff] rounded-lg">
              <button
                onClick={() => { setTxType('expense'); setSelectedCategory(null) }}
                className={`flex-1 py-2 text-title-sm rounded-md transition-all ${txType === 'expense' ? 'bg-white text-[#006948] shadow-sm' : 'text-[#3d4a42] hover:text-[#0b1c30]'}`}
              >
                Chi tiêu
              </button>
              <button
                onClick={() => { setTxType('income'); setSelectedCategory(null) }}
                className={`flex-1 py-2 text-title-sm rounded-md transition-all ${txType === 'income' ? 'bg-white text-[#006948] shadow-sm' : 'text-[#3d4a42] hover:text-[#0b1c30]'}`}
              >
                Thu nhập
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-white custom-shadow rounded-xl p-4 border border-[#bccac0]">
            <label className="text-label-caps text-[#3d4a42] block mb-2">SỐ TIỀN (VND)</label>
            <div className="flex items-center gap-4 border-b-2 border-[#bccac0] focus-within:border-[#006948] py-2 transition-all">
              <span className="text-number-xl text-[#006948]">₫</span>
              <input
                type="number"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent border-none focus:ring-0 text-number-xl text-[#0b1c30] placeholder:text-[#6d7a72] outline-none"
              />
            </div>
          </div>

          {/* Date */}
          <div className="bg-white custom-shadow rounded-xl p-4 border border-[#bccac0]">
            <label className="text-label-caps text-[#3d4a42] block mb-3">NGÀY GIAO DỊCH</label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#545f73]">calendar_today</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-body-md text-[#0b1c30] outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white custom-shadow rounded-xl p-4 border border-[#bccac0]">
            <label className="text-label-caps text-[#3d4a42] block mb-4">DANH MỤC</label>
            {categories.length === 0 ? (
              <p className="text-body-md text-[#6d7a72]">Đang tải danh mục...</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      selectedCategory === cat.id
                        ? 'border-[#006948] bg-[#006948]/5'
                        : 'border-transparent hover:bg-[#006948]/10'
                    }`}
                  >
                    <div className="bg-[#dce9ff] p-3 rounded-full">
                      <span className="material-symbols-outlined text-[#006948]">{cat.icon}</span>
                    </div>
                    <span className="text-xs font-semibold text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white custom-shadow rounded-xl p-4 border border-[#bccac0]">
            <label className="text-label-caps text-[#3d4a42] block mb-2">GHI CHÚ</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Nhập chi tiết giao dịch (VD: Ăn trưa cùng đồng nghiệp)..."
              className="w-full bg-transparent border-none focus:ring-0 text-body-md text-[#0b1c30] placeholder:text-[#6d7a72] resize-none outline-none"
            />
          </div>

          {error && (
            <p className="text-[#9b3e3b] text-body-md px-1">{error}</p>
          )}
        </div>

        {/* Right Column */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* OCR Upload */}
          <div className="bg-white custom-shadow rounded-xl border border-[#bccac0] p-4 flex-1 flex flex-col">
            <label className="text-label-caps text-[#3d4a42] block mb-4">TẢI LÊN HOẶC QUÉT HÓA ĐƠN</label>

            {previewImage ? (
              <div className="flex-1 relative rounded-xl overflow-hidden">
                <img src={previewImage} alt="Receipt" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-[#bccac0] rounded-xl flex flex-col items-center justify-center p-6 text-center group hover:border-[#006948] hover:bg-[#006948]/5 transition-all cursor-pointer"
              >
                <div className="bg-[#006948]/10 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#006948] text-4xl">document_scanner</span>
                </div>
                <h3 className="text-title-sm text-[#0b1c30] mb-1">Quét hóa đơn thông minh (OCR)</h3>
                <p className="text-body-md text-[#3d4a42] mb-4">Chụp ảnh hóa đơn để tự động nhập số tiền và ngày tháng.</p>
                <button
                  type="button"
                  className="bg-[#006948] text-white px-6 py-2 rounded-full text-label-caps hover:brightness-110 active:scale-95 transition-all"
                >
                  Chọn ảnh từ máy
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="mt-4 p-3 bg-[#dce9ff] rounded-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-[#006948]">auto_awesome</span>
              <p className="text-xs text-[#3d4a42]">Hệ thống AI sẽ tự động phân tích và điền thông tin cho bạn.</p>
            </div>
          </div>

          {/* CTA (Desktop) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={handleClear}
              className="flex-1 bg-[#d3e4fe] text-[#545f73] text-label-caps py-4 rounded-xl hover:bg-[#bccac0] transition-all active:scale-95"
            >
              Xóa trắng
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !amount || !selectedCategory}
              className="flex-[2] bg-[#006948] text-white text-label-caps py-4 rounded-xl shadow-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Đang lưu...' : 'Lưu Giao Dịch'}
            </button>
          </div>
        </div>
      </div>

      {/* CTA (Mobile) */}
      <div className="lg:hidden fixed bottom-16 left-0 w-full p-4 bg-[#f8f9ff]/80 backdrop-blur-md border-t border-[#bccac0] flex gap-3 z-40">
        <button
          onClick={handleClear}
          className="flex-1 bg-[#d3e4fe] text-[#545f73] text-label-caps py-3 rounded-lg active:scale-95 transition-all"
        >
          Xóa
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || !amount || !selectedCategory}
          className="flex-[2] bg-[#006948] text-white text-label-caps py-3 rounded-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          Lưu
        </button>
      </div>
    </div>
  )
}
