
import React, { useEffect, useState } from 'react'

export default function NewsFeed(){
  const [items,setItems]=useState<any[]>([])
  useEffect(()=>{ fetch('/api/news').then(r=>r.json()).then(d=>setItems(d.items||[])).catch(()=>{}) },[])
  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <h3 className="text-xl font-semibold mb-3">Новости 1С и автоматизации</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {items.slice(0,5).map((n,i)=>(
          <div key={i} className="card">
            <div className="text-sm opacity-60">{new Date(n.isoDate||n.pubDate||Date.now()).toLocaleDateString('ru-RU')}</div>
            <div className="font-medium">{n.title}</div>
            {n.link && <a href={n.link} className="underline" target="_blank" rel="noreferrer">читать источник</a>}
          </div>
        ))}
        {items.length===0 && <div className="card">Новости недоступны. Попробуйте позже.</div>}
      </div>
    </section>
  )
}
