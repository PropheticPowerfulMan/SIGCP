import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const source=new URL('../public/brand/emblem-presidence.jpg',import.meta.url);
const image='data:image/jpeg;base64,'+(await readFile(source)).toString('base64');
const browser=await chromium.launch({channel:process.platform==='win32'?'chrome':undefined,headless:true});
try{
 const page=await browser.newPage();
 await page.setContent('<!doctype html><html><body><canvas></canvas></body></html>');
 for(const [name,size,maskable] of [['icon-192.png',192,false],['icon-512.png',512,false],['icon-maskable-512.png',512,true],['apple-touch-icon-180.png',180,false],['favicon-64.png',64,false]]){
  const data=await page.evaluate(async({image,size,maskable})=>{
   const emblem=new Image();emblem.src=image;await emblem.decode();
   const canvas=document.querySelector('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d');
   ctx.fillStyle='#f7f7f7';ctx.fillRect(0,0,size,size);
   // Render the supplied emblem unchanged, with its full inscription and proportions.
   const margin=maskable?size*.145:size*.035;
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(emblem,margin,margin,size-margin*2,size-margin*2);
   if(size>=180&&!maskable){ctx.fillStyle='#007fff';ctx.fillRect(0,size-3,size*.64,3);ctx.fillStyle='#f7d618';ctx.fillRect(size*.64,size-3,size*.17,3);ctx.fillStyle='#ce1021';ctx.fillRect(size*.81,size-3,size*.19,3);}
   return canvas.toDataURL('image/png').split(',')[1];
  },{image,size,maskable});
  await writeFile(new URL('../public/brand/'+name,import.meta.url),Buffer.from(data,'base64'));
  console.log(name+': '+size+'×'+size+' · original emblem preserved');
 }
}finally{await browser.close();}
