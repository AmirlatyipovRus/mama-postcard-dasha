import {useEffect,useRef,useState,type CSSProperties} from 'react'
import {createRoot} from 'react-dom/client'
import '@fontsource-variable/caveat'
import '@fontsource-variable/nunito'
import {greeting as g} from './config/greeting'
import {Decor,Envelope,Icon} from './Art'
import './style.css'

type Stage='intro'|'closedEnvelope'|'openingEnvelope'|'notes'|'finalReveal'|'finalLetter'
const key='mama-letter-v1'
function restore():{stage:Stage,read:string[]}{
 try{const saved=JSON.parse(localStorage.getItem(key)||'{}')
 const read=g.notes.filter(n=>Array.isArray(saved.read)&&saved.read.includes(n.id)).map(n=>n.id)
 if(saved.stage==='finalLetter'&&read.length===9)return {stage:'finalLetter',read}
 if(saved.stage==='notes'||read.length)return {stage:'notes',read}
 if(saved.stage==='closedEnvelope')return {stage:'closedEnvelope',read}
 }catch{}
 return {stage:'intro',read:[]}
}
function duration(ms:number){return matchMedia('(prefers-reduced-motion:reduce)').matches?10:ms}
function useMusic(){
 const player=useRef<HTMLAudioElement|null>(null), frame=useRef(0), optedOut=useRef(false)
 const [playing,setPlaying]=useState(false),[available,setAvailable]=useState(g.enableMusic)
 useEffect(()=>()=>{cancelAnimationFrame(frame.current);player.current?.pause()},[])
 async function start(){if(!available||optedOut.current)return
 const p=player.current??new Audio(g.musicPath);player.current=p;p.loop=true;p.volume=.01
 try{await p.play();setPlaying(true);const begin=performance.now();cancelAnimationFrame(frame.current)
 function fade(now:number){p.volume=Math.min(.28,.01+(now-begin)/3000);if(p.volume<.28)frame.current=requestAnimationFrame(fade)}frame.current=requestAnimationFrame(fade)
 }catch{if(p.error)setAvailable(false);setPlaying(false)}}
 function stop(){cancelAnimationFrame(frame.current);player.current?.pause();setPlaying(false)}
 return {playing,available,start,stop,toggle(){optedOut.current=playing;if(playing)stop();else void start()}}
}
function App(){
 const [initial]=useState(restore),[stage,S]=useState<Stage>(initial.stage),[read,R]=useState(initial.read)
 const [selected,N]=useState<number|null>(null),[closing,C]=useState(false),[leaving,L]=useState(false),[photo,P]=useState(true)
 const dialog=useRef<HTMLDialogElement>(null),timer=useRef(0),trigger=useRef<HTMLButtonElement|null>(null),heading=useRef<HTMLHeadingElement>(null)
 const music=useMusic(),all=read.length===g.notes.length,n=selected===null?null:g.notes[selected]
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify({stage:stage==='openingEnvelope'?'notes':stage==='finalReveal'?'finalLetter':stage,read}))}catch{}},[stage,read])
 useEffect(()=>()=>clearTimeout(timer.current),[])
 useEffect(()=>{if(n)dialog.current?.showModal()},[n])
 useEffect(()=>{if(stage!=='intro')heading.current?.focus({preventScroll:true})},[stage])
 function later(fn:()=>void,ms:number){clearTimeout(timer.current);timer.current=window.setTimeout(fn,duration(ms))}
 function close(){if(closing)return;C(true);later(()=>{dialog.current?.close();N(null);C(false);trigger.current?.focus()},330)}
 function reset(){music.stop();R([]);S('intro');window.scrollTo(0,0)}
 const grid=stage==='notes'||stage==='openingEnvelope'
 return <main className={'scene '+stage}>
 <header><span className="postmark"><Icon kind="mail"/> Семейная почта</span>{music.available&&<button className="sound" aria-label={music.playing?'Выключить музыку':'Включить музыку'} aria-pressed={music.playing} onClick={music.toggle}><Icon kind={music.playing?'sound':'mute'}/></button>}</header>
 {g.showPetals&&<div className="petals" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{left:(i*13+2)+'%',animationDelay:-i*2.7+'s',animationDuration:14+i+'s'}}/>)}</div>}
 <Decor/>
 {stage==='intro'?<section className={'introSheet paper '+(leaving?'leaving':'')}><span className="tape"/><div className="stamp" aria-hidden="true"><img src="./art/floral.svg" alt=""/></div><div className="date">День матери</div><h1>{g.introTitle}</h1><div className="divider"><span>♡</span></div><ul>{g.introDescription.map((t,i)=><li key={t}><span className={'icon i'+i}><Icon kind={['mail','notes','heart'][i]}/></span>{t}</li>)}</ul><div className="introAction"><button className="primary" disabled={leaving} onClick={()=>{L(true);void music.start();later(()=>{S('closedEnvelope');L(false)},680)}}>Начать <Icon kind="arrow"/></button>{music.available&&<small><Icon kind="music"/> Лучше смотреть со звуком</small>}</div></section>
 :stage==='closedEnvelope'||grid?<section className="story"><h1 ref={heading} tabIndex={-1}>{stage==='closedEnvelope'?g.recipientName+', тебе письмо':all?'А теперь — самое главное…':'Записки для тебя'}</h1><p>{stage==='closedEnvelope'?'Внутри кое-что очень важное':all?'Осталось ещё одно письмо':'Открывай по одной'}</p>
 {grid&&<><div className={'hearts '+(all?'complete':'')} aria-label={'Прочитано '+read.length+' из 9'}>{g.notes.map(o=><span className={read.includes(o.id)?'lit':''} key={o.id}>♥</span>)}</div><div className="grid">{g.notes.map((o,i)=><button key={o.id} disabled={stage==='openingEnvelope'} aria-label={'Записка '+o.number+', '+o.title} style={{'--angle':o.angle+'deg','--color':o.color,'--delay':(.65+i*.13)+'s'} as CSSProperties} className={'note '+(read.includes(o.id)?'seen':'')} onClick={e=>{trigger.current=e.currentTarget;N(i);R(prev=>prev.includes(o.id)?prev:[...prev,o.id])}}><span className="tape"/>{o.number}<sup>{read.includes(o.id)?'♥':'♡'}</sup></button>)}</div></>}
 <div className="envArea">{stage==='closedEnvelope'?<button className="envButton" aria-label="Открыть конверт" onClick={()=>{S('openingEnvelope');later(()=>S('notes'),2450)}}><Envelope open={false}/></button>:<Envelope open/>}{grid&&all&&<button className="secret" onClick={()=>{S('finalReveal');later(()=>S('finalLetter'),2100)}}>♥ <b>Самое главное</b></button>}</div>
 {(stage==='closedEnvelope'||all)&&<p className="hint">{all?'Открой последнее письмо':'Нажми на конверт'}</p>}</section>
 :<article className="letter paper"><figure><span className="tape"/>{photo&&<img src={g.photoPath} alt="Наша семейная фотография" onError={()=>P(false)}/>} {!photo&&<><img src="./art/floral.svg" alt=""/><figcaption>Наше любимое фото</figcaption></>}</figure><h1 ref={heading} tabIndex={-1}>{g.finalTitle}</h1>{g.finalMessage.map(t=><p key={t}>{t}</p>)}<strong>{g.senderName}</strong><footer><button disabled={stage==='finalReveal'} className="primary" onClick={()=>{S('notes');window.scrollTo(0,0)}}>Перечитать записки</button><button disabled={stage==='finalReveal'} className="link" onClick={reset}>Начать сначала</button></footer></article>}
 {n&&<dialog ref={dialog} className={closing?'closing':''} onCancel={e=>{e.preventDefault();close()}} style={{'--color':n.color,'--origin':trigger.current?((trigger.current.getBoundingClientRect().left+trigger.current.offsetWidth/2)/innerWidth*100)+'% '+((trigger.current.getBoundingClientRect().top+trigger.current.offsetHeight/2)/innerHeight*100)+'%':'center'} as CSSProperties}><div className="modalPaper" onClick={close}><button aria-label="Закрыть записку" className="x" onClick={e=>{e.stopPropagation();close()}}>×</button><small>Записка {n.number} из 9</small><h2>{n.title}</h2><p>{n.text}</p><button className="link">Нажми, чтобы сложить</button></div></dialog>}
 </main>
}
createRoot(document.getElementById('root')!).render(<App/>)
