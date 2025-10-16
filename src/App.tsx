
import React, { useEffect, useMemo, useState } from 'react'
import Calendar from 'react-calendar'
import { Button, Switch, Modal } from './components/ui'
import NewsFeed from './components/NewsFeed'
import CatAssistant from './components/CatAssistant'
import { ChevronRight, Moon, Sun } from 'lucide-react'

const LOGO_LIGHT = '/logo-dark.png'  // тёмный логотип для светлой темы
const LOGO_DARK  = '/logo-light.png' // светлый логотип для тёмной темы

type Group = { title:string; items:string[]; icon?:string; desc:string; details:string }
const groups: Group[] = [
  { title:'Программы 1С', items:['ERP','CRM','Документооборот','УНФ','Бухгалтерия'],
    desc:'Внедряем и адаптируем конфигурации под процессы. Безопасные обновления.',
    details:`Проектируем архитектуру на базе актуальных версий 1С, сохраняем типовой функционал, добавляем расширения. 
Результат: сокращение TCO на 20–35%, прозрачная отчётность и меньше ручных операций.` },
  { title:'Отраслевые решения', items:['Производство','Торговля','ЖКХ','Строительство','Госсектор'],
    desc:'Практики под специфику отрасли. KPI и интеграции.',
    details:`Комплектуем систему отраслевыми шаблонами, аналитикой и интеграциями (WMS, MES, ЭДО, 1С-Битрикс, банки).
Результат: быстрый запуск (6–12 недель) и рост управляемости процессов.` },
  { title:'Услуги по 1С', items:['Внедрение','Настройка','Сопровождение','Интеграции','Обучение'],
    desc:'Полный цикл работ и поддержка по SLA.',
    details:`Движемся спринтами, фиксируем цели в дорожной карте, демо-итерации. 
Сервис-деск с регламентом реакции от 30 минут.` },
  { title:'Автоматизация процессов', items:['Производство','Закупки','CRM','Финансы','Логистика'],
    desc:'Исключаем узкие места и дублирование операций.',
    details:`Моделируем as-is/target, настраиваем алгоритмы планирования и резервирования.
Эффект: -10–15% в запасах, -30–50% ручных операций.` },
  { title:'Маркировка', items:['ЛС','Обувь','Табак','Текстиль','Молочка'],
    desc:'Интеграция с Честным Знаком/Меркурием в бизнес-сценарии.',
    details:`Встраиваем маркировку в приёмку/отгрузку/инвентаризацию, обучаем персонал. 
Ошибки сканирования снижаем до 0.2–0.5%.` },
  { title:'Бизнес‑анализ', items:['Power BI','Qlik','Jedox','PIX BI','Витрины данных'],
    desc:'Единые модели и доверенные витрины для решений на данных.',
    details:`Формируем роли безопасности и «паспорт отчётов». Время подготовки отчётов — минуты вместо дней.` },
  { title:'Крупному бизнесу', items:['ERP','MES','WMS','ITIL','RFID'],
    desc:'Масштабирование в холдинги и предсказуемые релизы.',
    details:`Архитектурный комитет, CI/CD для 1С, мониторинг и отказоустойчивость. 
Снижение операционных рисков и прозрачность релизного цикла.` },
  { title:'Обучение 1С', items:['Курсы','Корп. обучение','AI для 1С','Аттестации','База знаний'],
    desc:'Помогаем пользователям работать эффективно.',
    details:`Практические тренажёры и методические материалы. Снижение числа обращений на 20–30%.` },
]

const clients = [
  { name:'ООО «СеверПром»', tag:'Производство', brief:'ERP + WMS + EDI. План‑факт, себестоимость, адресный склад.', result:'-15% затрат, +22% производительность.' },
  { name:'ЗАО «ПензаМех»', tag:'Машиностроение', brief:'План закупок под заказы, МТО, интеграция с 1С:Бух.', result:'-25% избыточных закупок.' },
  { name:'ООО «АгроПром-Тех»', tag:'Агро', brief:'Планирование производства, рецептуры, прослеживаемость.', result:'-20% простоев.' },
  { name:'ООО «Молочные Истории»', tag:'Пищевая', brief:'Учёт себестоимости, Меркурий, маркировка.', result:'-18% потерь сырья.' },
  { name:'ООО «МебельЛайн»', tag:'Мебель', brief:'MRP, спецификации, калькуляция.', result:'+12% точность планирования.' },
  { name:'ООО «МеталлАрт»', tag:'Металл', brief:'Проектный учёт, CRM, себестоимость.', result:'Срок сделки -10%.' },
  { name:'ООО «Вектор Дистрибуция»', tag:'Торговля', brief:'CRM, акции, прайс‑листы, интеграции.', result:'+18% повторных продаж.' },
  { name:'ГК «РусЛогистика»', tag:'Логистика', brief:'WMS + TMS, ТСД, штрихкоды.', result:'+30% оборачиваемость склада.' },
  { name:'ООО «ПраймФудс»', tag:'FMCG', brief:'Честный ЗНАК, промо‑управление.', result:'Снижение штрафов на 40%.' },
  { name:'ООО «ИнтехСофт»', tag:'IT', brief:'Биллинг, договоры, портал.', result:'Сокращение DSO на 12 дней.' },
]

export default function App(){
  const [dark,setDark]=useState(false)
  const [date,setDate]=useState<Date>(new Date())
  const [moscow,setMoscow]=useState<Date>(new Date())
  const [modal,setModal]=useState<{title:string,body:string}|null>(null)
  const [clientsOpen,setClientsOpen]=useState(false)
  const [clientDetail,setClientDetail]=useState<number|null>(null)

  useEffect(()=>{
    document.documentElement.classList.toggle('dark',dark)
    const fav=document.getElementById('favicon') as HTMLLinkElement|null
    if(fav) fav.href = dark ? '/logo-light.png' : '/logo-dark.png'
  },[dark])

  useEffect(()=>{
    const tick=()=>{
      const now = new Date()
      const msk = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }))
      setDate(now); setMoscow(msk)
    }
    tick(); const t=setInterval(tick,1000); return ()=>clearInterval(t)
  },[])

  const timeMSK = useMemo(()=> moscow.toLocaleTimeString('ru-RU',{hour12:false,timeZone:'Europe/Moscow'}), [moscow])

  function openGroup(g:Group){ setModal({title:g.title, body:g.details}) }

  async function onSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const fd=new FormData(e.currentTarget as HTMLFormElement)
    const o=Object.fromEntries(fd.entries())
    const r = await fetch('https://synergy-server-0o0p.onrender.com/api/lead', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(o)})
    alert(r.ok?'Заявка отправлена':'Ошибка отправки')
    if(r.ok) (e.target as HTMLFormElement).reset()
  }

  return (
    <div className={dark?'dark':''}>
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-[#2a2f45] dark:text-[#e6e9f5] transition-colors">
        {/* Header */}
        <header className="max-w-[1400px] mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={dark?LOGO_DARK:LOGO_LIGHT} className="h-10 w-10 rounded-xl" alt="logo"/>
            <div>
              <div className="text-lg font-semibold">1С Синергия — Центр автоматизации бизнеса</div>
              <div className="text-xs opacity-70">Компания молодая, команда — 10+ лет экспертизы 1С</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="digital hidden md:inline">{timeMSK}</span>
            <Button onClick={()=>document.getElementById('lead')?.scrollIntoView({behavior:'smooth'})}>Оставить заявку</Button>
            <div className="flex items-center gap-2"><Moon/><Switch checked={dark} onChange={setDark}/><Sun/></div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 pb-12 grid grid-cols-12 gap-6">
          {/* Left aside */}
          <aside className="col-span-12 lg:col-span-3 space-y-4 order-2 lg:order-1">
            <button onClick={()=>setModal({title:'Где мы можем быть полезны', body:'Выберите направление в центральных карточках — каждое раскрывается с детальным описанием и эффектами.'})} className="aside-btn">
              <div className="font-semibold">Где мы можем быть полезны</div>
              <div className="text-xs opacity-70">8 направлений: ERP, CRM, BI, интеграции и др.</div>
            </button>
            <button onClick={()=>setClientsOpen(true)} className="aside-btn">
              <div className="font-semibold">Наши клиенты</div>
              <div className="text-xs opacity-70">10 примеров: что сделали и какой эффект.</div>
            </button>
            <div className="card">
              <div className="font-medium mb-3">Московское время</div>
              <div className="text-center py-4">
                <div className="text-4xl md:text-5xl font-mono digital">{timeMSK}</div>
                <div className="mt-2 text-xs opacity-70">MSK, обновление каждую секунду</div>
              </div>
            </div>
            <div className="card">
              <div className="font-medium mb-3">Календарь</div>
              <Calendar value={date} onChange={(v)=>setDate(v as Date)} />
            </div>
          </aside>

          {/* Center: groups and lead form */}
          <section className="col-span-12 lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="card">
              <h1 className="text-2xl font-bold mb-2">Внедрения 1С, которые создают измеримый эффект</h1>
              <p className="opacity-80">Мы проектируем и внедряем корпоративные системы на 1С: ERP, CRM, WMS, УХ и BI. Быстрый старт, безопасные обновления, прозрачная аналитика.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((g)=>(
                <article key={g.title} className="card group cursor-pointer" onClick={()=>openGroup(g)}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{g.title}</h3>
                    <ChevronRight className="opacity-60 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="mt-1 text-sm opacity-80">{g.items.join(' · ')}</div>
                  <p className="mt-2 text-sm">{g.desc}</p>
                </article>
              ))}
            </div>

            <div id="lead" className="card">
              <h2 className="text-xl font-semibold mb-3">Оставить заявку</h2>
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="name" placeholder="Имя" required className="w-full rounded-full px-3 py-2 bg-white/90 dark:bg-[#11162a] border border-white/40 dark:border-white/10" />
                <input name="phone" placeholder="Телефон" required className="w-full rounded-full px-3 py-2 bg-white/90 dark:bg-[#11162a] border border-white/40 dark:border-white/10" />
                <input name="email" type="email" placeholder="Email" required className="md:col-span-2 w-full rounded-full px-3 py-2 bg-white/90 dark:bg-[#11162a] border border-white/40 dark:border-white/10" />
                <textarea name="message" placeholder="Комментарий" className="md:col-span-2 w-full rounded-2xl px-3 py-2 bg-white/90 dark:bg-[#11162a] border border-white/40 dark:border-white/10" />
                <div className="md:col-span-2"><Button className="w-full">Отправить</Button></div>
              </form>
            </div>
          </section>

          {/* Right: contacts and news */}
          <section className="col-span-12 lg:col-span-3 space-y-6 order-3">
            <div className="card">
              <div className="text-sm">Телефон: <a href="tel:89394943315" className="underline decoration-dotted underline-offset-4">8 939 494-33-15</a></div>
              <div className="text-sm mt-1">Email: <a href="mailto:1c.integrator@mail.ru" className="underline decoration-dotted underline-offset-4">1c.integrator@mail.ru</a></div>
            </div>
            <NewsFeed />
          </section>
        </main>

        {/* Clients modal */}
        <Modal open={clientsOpen && clientDetail===null} onClose={()=>setClientsOpen(false)} title="Наши клиенты">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clients.map((c,idx)=>(
              <button key={c.name} className="card text-left" onClick={()=>setClientDetail(idx)}>
                <div className="text-xs opacity-70">{c.tag}</div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs opacity-70 mt-1">{c.brief}</div>
              </button>
            ))}
          </div>
        </Modal>
        <Modal open={clientDetail!==null} onClose={()=>setClientDetail(null)} title={clientDetail!==null?clients[clientDetail].name:''}>
          {clientDetail!==null && (
            <div className="space-y-2">
              <div className="text-xs opacity-70">{clients[clientDetail].tag}</div>
              <div><b>Контекст:</b> {clients[clientDetail].brief}</div>
              <div><b>Результат:</b> {clients[clientDetail].result}</div>
              <div className="text-xs opacity-70">Сопровождение по SLA, обучение, база знаний.</div>
            </div>
          )}
        </Modal>

        <footer className="text-center py-8 text-sm opacity-70">© 2025 1С Синергия · версия v21</footer>

        <CatAssistant/>
      </div>

      {/* Group details modal */}
      <Modal open={!!modal} onClose={()=>setModal(null)} title={modal?.title||''}>
        <p style={{whiteSpace:'pre-line'}}>{modal?.body}</p>
      </Modal>
    </div>
  )
}
