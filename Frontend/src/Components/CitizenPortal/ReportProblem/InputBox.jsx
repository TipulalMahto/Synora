import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import { useNetwork } from '../../../context/NetworkContext.jsx'
import { api } from '../../../lib/api.js'
import { classifyText, suggestTitle } from '../../../lib/classify.js'
import { compressImage } from '../../../lib/image.js'

const SUGGESTIONS = [
  { label: 'Water', icon: '💧', bg: 'bg-blue-50' },
  { label: 'Agriculture', icon: '🌾', bg: 'bg-green-50' },
  { label: 'Healthcare', icon: '🏥', bg: 'bg-pink-50' },
  { label: 'Education', icon: '🎓', bg: 'bg-indigo-50' },

  { label: 'Roads', icon: '🛣️', bg: 'bg-yellow-50' },
  { label: 'Sanitation', icon: '🗑️', bg: 'bg-purple-50' },
  { label: 'Electricity', icon: '💡', bg: 'bg-yellow-50' },
  { label: 'Transport', icon: '🚌', bg: 'bg-indigo-50' },

  { label: 'Environment', icon: '♻️', bg: 'bg-emerald-50' },
  { label: 'Livelihood', icon: '💼', bg: 'bg-orange-50' },
  { label: 'Other', icon: '➕', bg: 'bg-slate-50' },
]

const DISTRICTS = [
  'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
  'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara',
  'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu',
  'Ramgarh', 'Ranchi', 'Sahebganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum',
]

const InputBox = ({ onSubmitted }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const { online } = useNetwork()
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null) 
  const [busy, setBusy] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!photo) { setPreviewUrl(null); return }
    const url = URL.createObjectURL(photo)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null
    if (file && !file.type?.startsWith('image/')) {
      toast('Please choose an image file (jpg, png, etc.)', { type: 'error' })
      e.target.value = ''
      setPhoto(null)
      return
    }
    setPhoto(file)
  }

  function removePhoto() {
    setPhoto(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const [location, setLocation] = useState({
  village: '',
  panchayat: '',
  block: '',
  district: '',
  pincode: '',
})

function handleLocationChange(e) {
  const { name, value } = e.target
  setLocation((prev) => ({
    ...prev,
    [name]: value,
  }))
}

function handleNext() {
  setLocationOpen(false)
}

const [districtQuery, setDistrictQuery] = useState('')
const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false)

const filteredDistricts = DISTRICTS.filter((d) =>
  d.toLowerCase().includes(districtQuery.toLowerCase())
)

function handleDistrictSelect(d) {
  setLocation((prev) => ({ ...prev, district: d }))
  setDistrictQuery(d)
  setDistrictDropdownOpen(false)
}



  async function handleSubmit() {
    const description = text.trim()
    if (!description) {
      toast('Please describe the problem first', { type: 'error' })
      return
    }
    setBusy(true)
    try {
      const { category } = classifyText(description)
      let photos = []
      if (photo) {
        try {
          const dataUrl = await compressImage(photo)
          photos = [dataUrl]
        } catch {
          // Non-image or compression failed — submit without the photo rather than blocking.
        }
      }
      const result = await api.createReport(
        {
          category,
          title: suggestTitle(description) || description.slice(0, 60),
          description,
          photos,
          location,
          reporter: user ? { userEmail: user.email, userId: user.email, name: user.name } : { anonymous: true },
          ai: { category, confidence: classifyText(description).confidence },
        },
        { online },
      )
      if (result.merged) {
        toast('A similar problem already exists — your report was linked to it', { type: 'info' })
      // } else if (result.offline) {
      //   toast('Saved on this device — will sync once you are back online', { type: 'info' })
      } else {
        toast(`Problem reported successfully! Tracking ID: ${result.report.id}`, { type: 'success' })
      }
      setText('')
      setPhoto(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onSubmitted?.()
    } catch (err) {
      toast(err?.message || 'Could not submit the report. Please try again.', { type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

 function handlePickSuggestion(label) {
  setText((prev) => (prev ? `${prev} [${label}]:- ` : `[${label}]:- `))
}

  return (
    <>
    <div id="report-input" className={locationOpen ? 'blur-sm' : ''}>
        <div className="mx-auto mt-9 w-full max-w-210 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

  {/* Input Row */}
  <div className="flex items-center gap-4">

    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-xl">
      💬
    </div>

    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Tell your problem or tap 'Speak' in your own language"
      className="flex-1 bg-transparent text-lg outline-none placeholder:text-slate-400"
    />

    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />

    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      title={photo ? photo.name : 'Attach a photo'}
      className={`text-2xl ${photo ? 'text-green-600' : 'text-slate-500'}`}
    >
      📎
    </button>

    <button
  type="button"
  onClick={() => setLocationOpen(true)}
  title="Add location"
  className="flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3 font-semibold text-[#151044]"
>
  📍
  <span>Location</span>
</button>

    <button
      type="button"
      onClick={handleSubmit}
      disabled={busy}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#12294d] text-2xl text-white shadow-md disabled:opacity-60"
    >
      {busy ? '…' : '→'}
    </button>

  </div>

  {previewUrl && (
  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-3">
    <img
      src={previewUrl}
      alt="Selected photo preview"
      className="h-16 w-16 rounded-xl object-cover border border-green-300"
    />
    <div className="flex-1 min-w-0">
      <p className="truncate text-sm font-semibold text-green-800">{photo?.name}</p>
      <p className="text-xs text-green-600">Photo attached — will be submitted with your report</p>
    </div>
    <button
      type="button"
      onClick={removePhoto}
      className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
    >
      ✕ Remove
    </button>
  </div>
)}

  {/* Divider */}
  <div className="my-4 border-t border-slate-200"></div>

  {/* Suggestions */}
  <div className="flex flex-wrap items-center gap-3">
    <span className="text-sm text-slate-600">
      💡 Try asking about...
    </span>

    <div className="flex flex-wrap gap-6">
  {SUGGESTIONS.map((item) => (
    <button
      key={item.label}
      type="button"
      onClick={() => handlePickSuggestion(item.label)}
      className="group w-42 h-30 flex flex-col items-center justify-center rounded-[20px] border border-slate-200 bg-white shadow-sm hover:border-green-300 hover:shadow-md transition-all"
    >
      {/* Icon */}
      <div
        className={`
          mb-2
          flex h-14 w-14
          items-center justify-center
          rounded-[18px]
          ${item.bg}
          text-[28px]
          transition-transform duration-200
          group-hover:scale-110
        `}
      >
        {item.icon}
      </div>

      {/* Label */}
      <span className="text-[15px] font-bold text-slate-800">
        {item.label}
      </span>
    </button>
  ))}
</div>
  </div>

</div>

    </div>

    {locationOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
        <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-xl">

          <h2 className="text-2xl font-bold text-[#10264d]">Where is the problem?</h2>
          <p className="mt-1 text-sm text-slate-500">This helps route it to the right people</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Village</label>
              <input
                name="village"
                value={location.village}
                onChange={handleLocationChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Panchayat <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                name="panchayat"
                value={location.panchayat}
                onChange={handleLocationChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Block</label>
              <input
                name="block"
                value={location.block}
                onChange={handleLocationChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-400"
              />
            </div>

            <div className="relative">
  <label className="mb-1 block text-sm font-semibold text-slate-700">District</label>
  <input
    value={districtQuery}
    onChange={(e) => {
      setDistrictQuery(e.target.value)
      setLocation((prev) => ({ ...prev, district: e.target.value }))
      setDistrictDropdownOpen(true)
    }}
    onFocus={() => setDistrictDropdownOpen(true)}
    onBlur={() => setTimeout(() => setDistrictDropdownOpen(false), 150)}
    placeholder="Type or select district"
    autoComplete="off"
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-400"
  />

  {districtDropdownOpen && filteredDistricts.length > 0 && (
    <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
      {filteredDistricts.map((d) => (
        <button
          key={d}
          type="button"
          onMouseDown={() => handleDistrictSelect(d)}
          className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-green-50"
        >
          {d}
        </button>
      ))}
    </div>
  )}
</div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Pincode</label>
              <input
                name="pincode"
                value={location.pincode}
                onChange={handleLocationChange}
                maxLength={6}
                inputMode="numeric"
                placeholder="e.g. 831001"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-400"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLocationOpen(false)}
              className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-full bg-emerald-400 py-3 font-bold text-white"
            >
              Next →
            </button>
          </div>

          {text.trim() && (
            <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              {classifyText(text).category}
            </span>
          )}
        </div>
      </div>
    )}
    </>
  )
  
}

export default InputBox
