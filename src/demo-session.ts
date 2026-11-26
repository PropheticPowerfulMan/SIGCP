/** A UI-only demonstration session. This is not authentication or authorization. */
export const DEMO_SESSION_KEY='imperium-demo-session';
export const DEMO_ROLES=['Agent pilote','Responsable du courrier','Autorité de validation'] as const;
export type DemoRole=typeof DEMO_ROLES[number];
export interface DemoSession {version:1;role:DemoRole;startedAt:string;}
export function readDemoSession():DemoSession|null{
 try{const raw=sessionStorage.getItem(DEMO_SESSION_KEY);if(!raw)return null;const value:unknown=JSON.parse(raw);if(typeof value!=='object'||value===null)return null;const candidate=value as Record<string,unknown>;if(candidate.version!==1||!DEMO_ROLES.includes(candidate.role as DemoRole))return null;return {version:1,role:candidate.role as DemoRole,startedAt:typeof candidate.startedAt==='string'?candidate.startedAt:new Date().toISOString()};}catch{return null;}
}
export function startDemoSession(role?:string):DemoSession{
 const session:DemoSession={version:1,role:DEMO_ROLES.includes(role as DemoRole)?role as DemoRole:DEMO_ROLES[0],startedAt:new Date().toISOString()};
 try{sessionStorage.setItem(DEMO_SESSION_KEY,JSON.stringify(session));}catch{/* The demonstration can still run in memory when browser storage is blocked. */}
 return session;
}
export function closeDemoSession(){try{sessionStorage.removeItem(DEMO_SESSION_KEY);}catch{/* Only the in-memory UI session exists when storage is blocked. */}}
