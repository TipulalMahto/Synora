import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const tone={government:'bg-sky-50 text-sky-700',university:'bg-indigo-50 text-indigo-700',industry:'bg-amber-50 text-amber-700'}
export default function RoleShell({role,title,subtitle,icon:Icon,children}) {
 const {user,logout}=useAuth(); const t=tone[role]||'bg-emerald-50 text-emerald-700'
 return <div className="pb-14">
  <div className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
   <div className="flex items-center gap-4"><div className={`rounded-2xl ${t} p-3`}><Icon className="h-7 w-7"/></div><div><p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">{role}</p><h1 className="text-2xl font-black text-slate-900">{title}</h1><p className="text-sm text-slate-500">{subtitle}</p></div></div>
   <div className="hidden items-center gap-3 sm:flex"><div className="text-right"><p className="text-sm font-bold text-slate-800">{user?.name}</p><p className="text-xs text-slate-400">{user?.org}</p></div><button onClick={logout} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" title="Sign out"><LogOut className="h-4 w-4"/></button></div>
  </div></div>
  {children}
 </div>
}
