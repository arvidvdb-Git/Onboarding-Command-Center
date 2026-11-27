import 'dotenv/config';
import express from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';
import {resolve} from 'node:path';

const app = express();
const env = process.env;
const routes = {dashboard:'tt-dashboard', decision:'tt-decision', chat:'tt-chat'};
const digest = value => createHash('sha256').update(value).digest();
app.disable('x-powered-by');
app.use('/api/hr', (req,res,next) => {
  res.set('Cache-Control','no-store');
  if (!env.HR_USER || !env.HR_PASSWORD) return res.status(503).json({error:'HR access has not been configured.'});
  const expected = 'Basic '+Buffer.from(env.HR_USER+':'+env.HR_PASSWORD).toString('base64');
  if (!timingSafeEqual(digest(req.get('authorization') || ''), digest(expected))) {
    return res.set('WWW-Authenticate','Basic realm="Train Today HR"').status(401).json({error:'HR sign-in required.'});
  }
  if (req.method==='POST' && (req.get('origin')!==env.APP_URL || !req.is('application/json'))) {
    return res.status(403).json({error:'Unrecognized request origin or format.'});
  }
  next();
});
app.use(express.json({limit:'8kb'}));
app.get('/api/hr/form',(req,res)=>{
  if (!env.N8N_FORM_URL?.startsWith('https://')) return res.status(503).send('Set the protected n8n production form URL.');
  res.redirect(env.N8N_FORM_URL);
});
for (const [name,path] of Object.entries(routes)) {
  app[name==='dashboard'?'get':'post']('/api/hr/'+name,async(req,res)=>{
    if (!env.N8N_WEBHOOK_BASE || !env.N8N_HEADER_VALUE) return res.status(503).json({error:'Configure the server-side n8n connection.'});
    if (name==='chat' && (typeof req.body?.question!=='string' || !req.body.question.trim() || req.body.question.length>2000)) return res.status(400).json({error:'Enter a question of 1–2000 characters.'});
    if (name==='decision' && (!req.body?.id || !['approve','reject'].includes(req.body.decision))) return res.status(400).json({error:'Invalid approval request.'});
    try {
      const upstream=await fetch(env.N8N_WEBHOOK_BASE.replace(/\/$/,'')+'/'+path,{method:req.method,redirect:'error',signal:AbortSignal.timeout(90000),headers:{'Content-Type':'application/json',[env.N8N_HEADER_NAME || 'X-HR-Key']:env.N8N_HEADER_VALUE},body:req.method==='POST'?JSON.stringify(req.body):undefined});
      if (!upstream.ok) return res.status(502).json({error:'n8n '+name+' failed (HTTP '+upstream.status+'). Check the workflow execution.'});
      res.json(await upstream.json());
    } catch {res.status(502).json({error:'Could not confirm the n8n response. Refresh before retrying an approval.'});}
  });
}
if(process.argv.includes('--dev')){
  const {createServer}=await import('vite');
  app.use((await createServer({server:{middlewareMode:true},appType:'spa'})).middlewares);
} else {
  app.use(express.static(resolve('dist')));
  app.get('*',(_,res)=>res.sendFile(resolve('dist/index.html')));
}
app.listen(Number(env.PORT||3000),'0.0.0.0');
