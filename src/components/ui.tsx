
import React from 'react'

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({className='', ...p}) =>
  <button {...p} className={`btn ${className}`} />

export function Switch({checked,onChange}:{checked:boolean; onChange:(v:boolean)=>void}){
  return (
    <button onClick={()=>onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition shadow-neo dark:shadow-neodark ${checked?'bg-[#5a6ee1]':'bg-brand-light dark:bg-[#171b2a]'}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked?'translate-x-6':'translate-x-1'}`} />
    </button>
  )
}

export function Modal({open, onClose, title, children}:{open:boolean; onClose:()=>void; title:string; children:React.ReactNode}){
  if(!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button className="btn" onClick={onClose}>Закрыть</button>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">{children}</div>
      </div>
    </div>
  )
}
