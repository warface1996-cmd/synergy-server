
import React, { useEffect, useState } from 'react'

const phrases = [
  'Я тебя ждал 😊','Добро пожаловать!','Где нужна автоматизация?',
  'Считаю ROI… почти готово!','Помогу выбрать 1С под задачу'
]

export default function CatAssistant(){
  const [visible,setVisible]=useState(false)
  const [phrase,setPhrase]=useState(phrases[0])
  useEffect(()=>{
    const show=()=>{ setPhrase(phrases[Math.floor(Math.random()*phrases.length)]); setVisible(true); setTimeout(()=>setVisible(false),5000) }
    const first=setTimeout(show,3000)
    const i=setInterval(show,15000)
    return ()=>{ clearTimeout(first); clearInterval(i) }
  },[])
  return (<>
    <img id="cat" src="/cat.png" className={visible?'visible':''} alt="cat"/>
    <div id="bubble" className={visible?'show':''}>{phrase}</div>
  </>)
}
