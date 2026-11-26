import {useEffect, useId, useRef, type ReactNode} from 'react';
import {X,FileText,Inbox,Check,AlertTriangle} from 'lucide-react';
import type {Mail,MailStatus} from './domain.ts';
export function Modal({title,children,onClose,wide=false}:{title:string;children:ReactNode;onClose:()=>void;wide?:boolean}) {
 const ref=useRef<HTMLDialogElement>(null);const id=useId();
 useEffect(()=>{const el=ref.current;const previous=document.activeElement as HTMLElement|null;el?.showModal();return()=>{el?.close();previous?.focus()}},[]);
 return <dialog ref={ref} className={`modal ${wide?'modal-wide':''}`} aria-labelledby={id} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target!==e.currentTarget)return;const bounds=e.currentTarget.getBoundingClientRect();if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom)onClose()}}><div className="modal-head"><div><span className="eyebrow">ESPACE DE DÉMONSTRATION</span><h2 id={id}>{title}</h2></div><button className="icon-button" aria-label="Fermer la fenêtre" onClick={onClose}><X size={21}/></button></div><div className="modal-body">{children}</div></dialog>
}
export function Empty({title='Aucun courrier trouvé',description='Essayez d’autres critères ou ajoutez un courrier fictif.',action}:{title?:string;description?:string;action?:ReactNode}){return <div className="empty"><div className="empty-icon"><Inbox size={29}/></div><h3>{title}</h3><p>{description}</p>{action}</div>}
export function Status({value}:{value:string}){const color=value==='Échec'?'red':value==='Archivé'?'slate':['Validé','Expédié','Accusé confirmé'].includes(value)?'green':value==='En validation'?'amber':'blue';return <span className={`badge ${color}`}><span className="status-dot"/>{value}</span>}
export function Priority({value}:{value:Mail['priority']}){return <span className={`priority ${value==='Urgente'?'red':value==='Haute'?'amber':'slate'}`}>{value==='Urgente'&&<span className="status-dot"/>}{value}</span>}
export function Notice({children,danger=false}:{children:ReactNode;danger?:boolean}){return <div className={`notice ${danger?'danger':''}`}>{danger?<AlertTriangle size={19}/>:<FileText size={19}/>}<div>{children}</div></div>}
export const formatDate=(value:string,long=false)=>new Date(value+'T12:00:00').toLocaleDateString('fr-CD',{day:'2-digit',month:long?'long':'short',...(long?{year:'numeric'}:{})});
export const formatTime=(value:string)=>new Date(value).toLocaleString('fr-CD',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Africa/Kinshasa'});
export function download(content:string,name:string,type='text/plain;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
export function Toast({text}:{text:string}){return <div className="toast" role="status"><Check size={18}/>{text}</div>}


