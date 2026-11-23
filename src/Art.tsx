export function Icon({kind}:{kind:string}){
const paths:Record<string,React.ReactNode>={
mail:<><rect x="3" y="6" width="18" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></>,
notes:<><path d="m5 6 12-2 2 15-12 2zM8 8l6-1m-6 5 7-1m-6 5 5-1"/></>,
heart:<path d="M12 20C-5 9 5 0 12 8 19 0 29 9 12 20Z"/>,
sound:<><path d="M3 10h4l5-5v14l-5-5H3zM16 8q4 4 0 8m3-11q7 7 0 14"/></>,
mute:<><path d="M3 10h4l5-5v14l-5-5H3zM16 9l6 6m0-6-6 6"/></>,
music:<><path d="M10 17V6l10-2v11M10 9l10-2"/><ellipse cx="7" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/></>,
arrow:<path d="M4 12h15m-6-6 6 6-6 6"/>}
return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[kind]}</svg>}
export function Envelope({open}:{open:boolean}){return <div className={'env '+(open?'unsealed':'')}><div className="envBack"/><div className="flap"/><div className="envFront"/><div className="ribbon"/><div className="seal"><Icon kind="heart"/></div></div>}
export function Decor(){return <div className="decor" aria-hidden="true"><img className="lace" src="./art/lace.svg" alt=""/><div className="tea"><i/><i/><img src="./art/tea.svg" alt=""/></div><img className="tulips" src="./art/tulips.svg" alt=""/></div>}
