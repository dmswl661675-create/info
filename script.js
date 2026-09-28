let savedRange=null;
const poster=document.getElementById("poster");

function bindImageInput(input){
  if(input.dataset.bound)return;
  input.dataset.bound="1";
  input.addEventListener("change",()=>{
    const f=input.files?.[0]; if(!f)return;
    const label=input.closest("label"),img=label.querySelector("img"),span=label.querySelector("span");
    const r=new FileReader();
    r.onload=e=>{img.src=e.target.result;img.style.display="block";if(span)span.style.display="none"};
    r.readAsDataURL(f);
  });
}
document.querySelectorAll('input[type=file]:not(#bgImageInput)').forEach(bindImageInput);

document.addEventListener("selectionchange",()=>{
  const s=getSelection(); if(!s?.rangeCount)return;
  const n=s.anchorNode,el=n&&(n.nodeType===3?n.parentElement:n);
  if(el?.closest?.('[contenteditable="true"]'))savedRange=s.getRangeAt(0).cloneRange();
});
function restore(){if(!savedRange)return false;const s=getSelection();s.removeAllRanges();s.addRange(savedRange);return true}
function styleSelection(prop,val){
  if(!restore())return; const s=getSelection();
  if(s.isCollapsed){const n=s.anchorNode,el=(n.nodeType===3?n.parentElement:n).closest('[contenteditable="true"]');if(el)el.style[prop]=val;return}
  const r=s.getRangeAt(0),span=document.createElement("span");span.style[prop]=val;
  try{r.surroundContents(span)}catch{const f=r.extractContents();span.appendChild(f);r.insertNode(span)}
  const nr=document.createRange();nr.selectNodeContents(span);s.removeAllRanges();s.addRange(nr);savedRange=nr.cloneRange();
}
function toggle(prop,on,off){
  if(!restore())return;const s=getSelection(),n=s.anchorNode,el=n.nodeType===3?n.parentElement:n,c=getComputedStyle(el)[prop];
  const active=prop==="fontWeight"?(parseInt(c)>=600||c==="bold"):c===on;styleSelection(prop,active?off:on)
}
fontFamily.onchange=e=>styleSelection("fontFamily",e.target.value);
textColor.oninput=e=>styleSelection("color",e.target.value);
boldBtn.onmousedown=italicBtn.onmousedown=e=>e.preventDefault();
boldBtn.onclick=()=>toggle("fontWeight","700","400");italicBtn.onclick=()=>toggle("fontStyle","italic","normal");

const colors=[
["화이트","#ffffff"],["민트","#e8faf6"],["연민트","#eef9ed"],["하늘","#eaf7ff"],
["연파랑","#e7f0ff"],["블루","#e3ebff"],["라벤더","#f0eaff"],["연핑크","#fff0f4"],
["핑크","#ffe4ed"],["연주황","#fff0e8"],["피치","#ffe5d2"],["연노랑","#fff8d9"],
["크림","#fffaf0"],["베이지","#f8f1e5"],["연그레이","#f3f4f6"],["블루그레이","#eaf0f7"],
["연보라","#f4efff"],["복숭아","#fff0e8"]
];
const swatches=document.getElementById("swatches");
colors.forEach(([name,color])=>{
 const b=document.createElement("button");b.className="swatch";b.style.background=color;b.title=name;b.innerHTML=`<span>${name}</span>`;
 b.onclick=()=>{poster.style.backgroundImage="none";poster.style.backgroundColor=color};swatches.appendChild(b)
});
backgroundBtn.onclick=()=>{bgPanel.classList.add("show");backdrop.classList.add("show")};
function closePanel(){bgPanel.classList.remove("show");backdrop.classList.remove("show")}
closeBg.onclick=backdrop.onclick=closePanel;
applyCustomColor.onclick=()=>{poster.style.backgroundImage="none";poster.style.backgroundColor=customBgColor.value};

bgImageInput.onchange=()=>{
 const f=bgImageInput.files?.[0];if(!f)return;const r=new FileReader();
 r.onload=e=>poster.style.backgroundImage=`url("${e.target.result}")`;r.readAsDataURL(f)
};
bgSize.onchange=e=>poster.style.backgroundSize=e.target.value;
bgPosition.onchange=e=>poster.style.backgroundPosition=e.target.value;
removeBgImage.onclick=()=>poster.style.backgroundImage="none";

const grid=document.getElementById("goodsGrid"),tpl=document.getElementById("goodTemplate");
function addGood(name="굿즈 이름",price="0,000원"){
 const node=tpl.content.firstElementChild.cloneNode(true);node.querySelector("h3").textContent=name;node.querySelector("strong").textContent=price;
 bindImageInput(node.querySelector('input[type=file]'));node.querySelector(".deleteGood").onclick=()=>node.remove();grid.appendChild(node)
}
addGoodBtn.onclick=()=>addGood();
addGood("아크릴 스탠드","7,000원");addGood("포토카드 세트","5,000원");addGood("키링","6,000원");addGood("스티커 세트","4,000원");

saveBtn.onclick=async()=>{
 document.activeElement.blur();document.body.classList.add("exporting");
 try{
  const canvas=await html2canvas(poster,{scale:2,useCORS:true,backgroundColor:null});
  const a=document.createElement("a");a.download="event-info.png";a.href=canvas.toDataURL("image/png");a.click()
 }finally{document.body.classList.remove("exporting")}
};
