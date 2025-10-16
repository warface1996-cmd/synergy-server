import 'dotenv/config';
console.log('[debug] TOKEN из .env:', process.env.VITE_TELEGRAM_TOKEN ? 'найден' : 'НЕ найден');
console.log('[debug] CHAT_ID из .env:', process.env.VITE_TELEGRAM_CHAT_ID ? 'найден' : 'НЕ найден');

import express from 'express';
import Parser from 'rss-parser';
import NodeCache from 'node-cache';

const app = express();
app.use(express.json());
const cache = new NodeCache();
const parser = new Parser();

const TOKEN = process.env.VITE_TELEGRAM_TOKEN;
const CHAT = process.env.VITE_TELEGRAM_CHAT_ID;


const FEEDS=[
  'https://habr.com/ru/rss/hub/1c/all/?fl=ru',
  'https://habr.com/ru/rss/hub/automation/all/?fl=ru'
]

app.get('/api/news', async (req,res)=>{
  try{
    const key='news24h'; const c=cache.get(key); if(c) return res.json(c)
    let items=[]
    for(const u of FEEDS){ try{ const f=await parser.parseURL(u); items=items.concat((f.items||[]).slice(0,5)) }catch{} }
    items.sort((a,b)=> new Date(b.isoDate||b.pubDate||0)-new Date(a.isoDate||a.pubDate||0))
    const payload={items:items.slice(0,5)}
    cache.set(key,payload,60*60*24)
    res.json(payload)
  }catch{ res.json({items:[]}) }
})

app.post('/api/lead', async (req,res)=>{
  try{
    const {name,phone,email,message}=req.body||{}
    if(!name||!phone||!email) return res.status(400).json({ok:false})
    if(TOKEN&&CHAT){
      const text=`🟢 Новая заявка\nИмя: ${name}\nТелефон: ${phone}\nEmail: ${email}\nСообщение: ${message||'—'}`
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:CHAT,text})})
    }
    res.json({ok:true})
  }catch{ res.status(500).json({ok:false}) }
})
// 🟢 Универсальный запуск сервера
const PORT = process.env.PORT || 3001;
// 🔍 Проверка подключения к Telegram при запуске
import fetch from 'node-fetch';

async function testTelegramConnection() {
  if (!TOKEN || !CHAT) {
    console.log('[telegram] ⚠️  TOKEN или CHAT_ID не заданы (.env)');
    return;
  }

  try {
    const msg = '🤖 Тест подключения к боту (Синергия · 1С)';
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT, text: msg }),
    });
    const data = await res.json();

    if (data.ok) {
      console.log(`[telegram] ✅ Подключено: сообщение доставлено (${data.result.chat.username || 'OK'})`);
    } else {
      console.log(`[telegram] ❌ Ошибка: ${data.description || 'неизвестная'}`);
    }
  } catch (err) {
    console.log(`[telegram] ❌ Не удалось подключиться: ${err.message}`);
  }
}

// вызываем проверку
testTelegramConnection();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[server] 🚀 Running on port ${PORT}`);
});
