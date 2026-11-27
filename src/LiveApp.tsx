import {useCallback,useEffect,useRef,useState} from 'react';
import {Navbar} from './components/Navbar';
import type {ScreenView} from './types/onboarding';

type Employee={id:string,name:string,department:string,state:string,review?:{data:Record<string,unknown>,cv:string,contract:string}};
type Task={id:number,case_id:string,title:string,team:string,state:string,reference?:string,warning?:string};
type Snapshot={employees:Employee[],tasks:Task[],warnings:{id:number,message:string}[]};
async function request(path:string,body?:object){
  const res=await fetch('/api/hr/'+path,{cache:'no-store',method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  let data;
  try{data=await res.json()}catch{throw Error('HR API unavailable. Check the app server.')}
  if(!res.ok)throw Error(data.error || 'Request failed.');
  return data;
}
const viewFromHash=():ScreenView=>location.hash==='#directory'?'directory':'command-center';
const button='rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm hover:bg-stone-100 disabled:opacity-50';
const panel='rounded-2xl border border-stone-200 bg-white p-5 shadow-sm';
function light(state:string){
  const tone=['done','active'].includes(state)?'bg-green-600':['needs_human','rejected','blocked'].includes(state)?'bg-red-600':'bg-amber-500';
  return <span className="inline-flex items-center gap-2 text-sm"><i className={'size-2 rounded-full '+tone}/>{state.replaceAll('_',' ')}</span>;
}
export default function LiveApp(){
  const [view,setView]=useState(viewFromHash),[snapshot,setSnapshot]=useState<Snapshot>(),[selected,select]=useState(''),[form,openForm]=useState(false);
  const [error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[sync,syncing]=useState(false);
  const [question,ask]=useState(''),[answer,respond]=useState(''),[asking,setAsking]=useState(false);
  const loading=useRef(false);
  const refresh=useCallback(async()=>{
    if(loading.current)return;
    loading.current=true;syncing(true);
    try{const data=await request('dashboard');if(!['employees','tasks','warnings'].every(k=>Array.isArray(data[k])))throw Error('Invalid dashboard response.');setSnapshot(data);setError('')}
    catch(e){setError(String(e))}finally{loading.current=false;syncing(false)}
  },[]);
  useEffect(()=>{void refresh();const timer=setInterval(refresh,20000);const hash=()=>setView(viewFromHash());window.addEventListener('hashchange',hash);return()=>{clearInterval(timer);window.removeEventListener('hashchange',hash)}},[refresh]);
  const employees=snapshot?.employees||[],employee=employees.find(e=>e.id===selected)||employees[0];
  const navigate=(v:ScreenView)=>{location.hash=v;setView(v)};
  async function decide(decision:string){
    if(!employee)return;setBusy(true);
    try{const r=await request('decision',{id:employee.id,decision});setNotice('Review result: '+r.state);await refresh()}catch(e){setNotice(String(e))}finally{setBusy(false)}
  }
  return <div className="min-h-screen bg-[#f6f4ee] text-slate-900">
    <Navbar activeView={view} onSelectView={navigate} onOpenNewEmployee={()=>openForm(true)} totalEmployees={employees.length} onSync={refresh} syncStatus={sync?'syncing':snapshot?'synced':'idle'}/>
    <main className="mx-auto max-w-6xl space-y-5 px-5 py-8">
    <h1 className="text-3xl font-bold">{view==='directory'?'Employee directory':'Onboarding command center'}</h1>
    {error&&<p role="alert" className="bg-red-50 p-3">{error}</p>}{notice&&<p role="status">{notice}</p>}
    {snapshot?.warnings.map(w=><p role="alert" className="bg-amber-100 p-3" key={w.id}>{w.message}</p>)}
    {form&&<section className={panel}><div className="flex justify-between"><a href="/api/hr/form" target="_blank" rel="noreferrer">Open intake in a new tab</a><button className={button} onClick={()=>{openForm(false);void refresh()}}>Close and refresh</button></div><iframe title="New employee intake" className="mt-4 h-[65vh] w-full" src="/api/hr/form"/></section>}
    {view==='directory'?<section className={panel}>{employees.filter(e=>e.state==='active').map(e=><button className="flex w-full items-center justify-between border-b p-3 text-left" key={e.id} onClick={()=>{select(e.id);navigate('command-center')}}><strong>{e.name}</strong><span>{e.department}</span></button>)}{snapshot&&!employees.some(e=>e.state==='active')&&'No approved employees yet.'}</section>:
    <>{employee?<section className={panel}><label>Employee <select className={button} value={employee.id} onChange={e=>select(e.target.value)}>{employees.map(e=><option key={e.id} value={e.id}>{e.name || e.id}</option>)}</select></label><div className="my-3">{light(employee.state)}</div>
    {employee.review&&<div><dl className="grid gap-2 sm:grid-cols-2">{Object.entries(employee.review.data).filter(([,v])=>['string','number','boolean'].includes(typeof v)).map(([k,v])=><div key={k}><dt className="text-xs text-stone-500">{k}</dt><dd>{String(v)}</dd></div>)}</dl><div className="my-4 flex flex-wrap gap-3">{(['cv','contract'] as const).map(k=><a className={button} key={k} target="_blank" rel="noreferrer" href={'https://drive.google.com/open?id='+encodeURIComponent(employee.review![k])}>Review {k==='cv'?'CV':'contract'}</a>)}{['approve','reject'].map(d=><button className={button} key={d} disabled={busy} onClick={()=>decide(d)}>{d==='approve'?'Approve profile':'Reject submission'}</button>)}</div></div>}
    {snapshot?.tasks.filter(t=>String(t.case_id)===String(employee.id)).map(t=><div key={t.id} className="border-t py-3"><div className="flex justify-between gap-4"><strong>{t.title}</strong>{light(t.state)}</div><small>{[t.team,t.reference,t.warning].filter(Boolean).join(' · ')}</small></div>)}</section>:<p>{snapshot?'No onboarding cases yet.':'Loading onboarding cases…'}</p>}</>}
    <form className={panel} onSubmit={async e=>{e.preventDefault();setAsking(true);try{const r=await request('chat',{question});respond(r.answer||'No answer returned.')}catch(err){respond(String(err))}finally{setAsking(false)}}}><label className="block font-semibold" htmlFor="ask">Onboarding assistant</label><div className="mt-3 flex gap-2"><input id="ask" className="min-w-0 flex-1 rounded border p-2" value={question} onChange={e=>ask(e.target.value)} maxLength={2000} placeholder="Ask about an employee, onboarding, or Jira ticket"/><button className={button} disabled={asking||!question.trim()}>{asking?'Asking…':'Ask'}</button></div>{answer&&<p role="status" className="mt-4 whitespace-pre-wrap">{answer}</p>}</form>
    </main></div>;
}
