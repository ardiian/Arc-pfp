<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Arc — Kartu Anggota</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg-deep:#120b22;
    --bg-mid:#1e1438;
    --bg-panel:#1a1330;
    --gold:#c9a35c;
    --gold-dim:#8a744a;
    --copper:#b5793f;
    --cream:#f2ead9;
    --cream-dim:#a89ecb;
    --line:#3a2e5c;
    --red:#d9484a;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  html,body{height:100%;}
  body{
    background:
      radial-gradient(1200px 600px at 15% -10%, #2a1d4d 0%, transparent 60%),
      radial-gradient(1000px 500px at 100% 110%, #241a42 0%, transparent 55%),
      var(--bg-deep);
    color:var(--cream);
    font-family:'Inter',sans-serif;
    min-height:100vh;
    overflow-x:hidden;
  }
  .constellation{
    position:fixed; inset:0; z-index:0; opacity:.35; pointer-events:none;
  }
  .wrap{
    position:relative; z-index:1;
    max-width:1320px; margin:0 auto; padding:48px 28px 80px;
  }
  header{
    display:flex; align-items:center; gap:14px; margin-bottom:6px;
  }
  .mark{
    width:38px; height:38px; position:relative; flex-shrink:0;
  }
  .mark svg{width:100%; height:100%; display:block;}
  .wordmark{
    font-family:'Cormorant Garamond', serif;
    font-weight:700; font-size:30px; letter-spacing:.02em;
    color:var(--cream);
  }
  .eyebrow{
    font-family:'JetBrains Mono', monospace;
    font-size:11px; letter-spacing:.22em; text-transform:uppercase;
    color:var(--gold-dim); margin:22px 0 6px;
  }
  h1{
    font-family:'Cormorant Garamond', serif;
    font-weight:600; font-size:clamp(30px,4vw,44px);
    line-height:1.05; color:var(--cream); max-width:640px;
  }
  .sub{
    color:var(--cream-dim); font-size:15px; margin-top:12px; max-width:520px; line-height:1.55;
  }
  .grid{
    display:grid; grid-template-columns:minmax(300px,380px) 1fr;
    gap:40px; margin-top:48px; align-items:start;
  }
  @media (max-width:880px){ .grid{grid-template-columns:1fr;} }

  .panel{
    background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0));
    border:1px solid var(--line);
    border-radius:14px;
    padding:28px;
  }
  .field{ margin-bottom:20px; }
  .field label{
    display:block; font-family:'JetBrains Mono',monospace; font-size:11px;
    letter-spacing:.12em; text-transform:uppercase; color:var(--cream-dim); margin-bottom:8px;
  }
  .field input[type=text], .field select{
    width:100%; background:var(--bg-mid); border:1px solid var(--line);
    color:var(--cream); font-family:'Inter',sans-serif; font-size:14.5px;
    padding:11px 13px; border-radius:8px; outline:none;
    transition:border-color .15s;
  }
  .field input[type=text]:focus, .field select:focus{ border-color:var(--gold); }
  .field select{ appearance:none; cursor:pointer;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0 L5 6 L10 0' fill='none' stroke='%23c9a35c' stroke-width='1.4'/></svg>");
    background-repeat:no-repeat; background-position:right 14px center;
  }
  .row2{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  .photo-drop{
    border:1.5px dashed var(--line); border-radius:10px; padding:18px;
    text-align:center; cursor:pointer; color:var(--cream-dim); font-size:13px;
    transition:border-color .15s, background .15s; position:relative;
  }
  .photo-drop:hover{ border-color:var(--gold); background:rgba(201,163,92,.04); }
  .photo-drop input{ position:absolute; inset:0; opacity:0; cursor:pointer; }
  .photo-drop.has-img{ padding:0; border-style:solid; }
  .photo-drop.has-img img{ width:100%; height:120px; object-fit:cover; border-radius:9px; display:block; }

  .btn{
    width:100%; padding:14px; border-radius:9px; border:none; cursor:pointer;
    font-family:'Inter',sans-serif; font-weight:600; font-size:14.5px; letter-spacing:.01em;
    background:linear-gradient(135deg, var(--gold), var(--copper));
    color:#1a1330; margin-top:6px;
    transition:filter .15s, transform .1s;
  }
  .btn:hover{ filter:brightness(1.08); }
  .btn:active{ transform:scale(.99); }
  .btn.secondary{
    background:transparent; border:1px solid var(--gold-dim); color:var(--gold);
    margin-top:10px;
  }

  .preview-stage{
    display:flex; flex-direction:column; align-items:center; gap:18px;
  }
  #cardCanvas{
    width:100%; max-width:920px; height:auto; border-radius:16px;
    box-shadow:0 30px 70px -20px rgba(0,0,0,.65), 0 0 0 1px var(--line);
  }
  .hint{ color:var(--cream-dim); font-size:12.5px; text-align:center; max-width:480px; }

  footer{ margin-top:70px; text-align:center; color:var(--gold-dim); font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.15em; }
</style>
</head>
<body>

<canvas class="constellation" id="bgCanvas"></canvas>

<div class="wrap">
  <header>
    <div class="mark">
      <svg viewBox="0 0 100 100"><path d="M50 10 L88 90 L68 90 L50 50 L32 90 L12 90 Z" fill="none" stroke="url(#g)" stroke-width="7" stroke-linejoin="round"/>
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9a35c"/><stop offset="1" stop-color="#7a5fd4"/></linearGradient></defs>
      </svg>
    </div>
    <div class="wordmark">Arc</div>
  </header>

  <div class="eyebrow">Chapter Membership</div>
  <h1>Buat kartu pengenal anggotamu.</h1>
  <p class="sub">Isi data di bawah, kartu akan ter-render otomatis di sisi kanan. Unduh sebagai PNG untuk dipakai sebagai foto profil atau dibagikan ke chapter-mu.</p>

  <div class="grid">
    <div class="panel">
      <div class="field">
        <label>Nama Anggota</label>
        <input type="text" id="fName" placeholder="Chimil" maxlength="26">
      </div>

      <div class="row2">
        <div class="field">
          <label>Kota</label>
          <input type="text" id="fCity" placeholder="Jakarta" maxlength="20">
        </div>
        <div class="field">
          <label>Negara</label>
          <input type="text" id="fCountry" placeholder="Indonesia" maxlength="20">
        </div>
      </div>

      <div class="field">
        <label>Chapter Wilayah</label>
        <select id="fChapter">
          <option>North America</option>
          <option>Latin America</option>
          <option>Europe</option>
          <option>Africa</option>
          <option>Middle East</option>
          <option selected>South Asia</option>
          <option>Southeast Asia</option>
          <option>East Asia</option>
          <option>Oceania</option>
        </select>
      </div>

      <div class="field">
        <label>Kode Bendera (ISO-2, opsional)</label>
        <input type="text" id="fFlag" placeholder="ID" maxlength="2" style="text-transform:uppercase">
      </div>

      <div class="field">
        <label>Foto (opsional)</label>
        <div class="photo-drop" id="photoDrop">
          <span id="photoDropText">Klik atau tarik foto ke sini</span>
          <input type="file" id="fPhoto" accept="image/*">
        </div>
      </div>

      <button class="btn" id="downloadBtn">Unduh Kartu (PNG)</button>
      <button class="btn secondary" id="resetPhotoBtn">Hapus Foto</button>
    </div>

    <div class="preview-stage">
      <canvas id="cardCanvas" width="1600" height="600"></canvas>
      <p class="hint">Pratinjau diperbarui otomatis. Kanvas dirender di browser — tidak ada data yang dikirim ke server.</p>
    </div>
  </div>

  <footer>ARC · GLOBAL BUILDERS · LOCAL CHAPTERS</footer>
</div>

<script>
/* ---------- ambient constellation background ---------- */
const bg = document.getElementById('bgCanvas');
const bctx = bg.getContext('2d');
function sizeBg(){ bg.width = innerWidth; bg.height = innerHeight; }
sizeBg(); addEventListener('resize', sizeBg);
const nodes = Array.from({length:70}, () => ({
  x: Math.random()*innerWidth, y: Math.random()*innerHeight,
  vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.15
}));
function drawBg(){
  bctx.clearRect(0,0,bg.width,bg.height);
  bctx.fillStyle = '#c9a35c';
  for(const n of nodes){
    n.x += n.vx; n.y += n.vy;
    if(n.x<0||n.x>bg.width) n.vx*=-1;
    if(n.y<0||n.y>bg.height) n.vy*=-1;
  }
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
      const d = Math.hypot(dx,dy);
      if(d<130){
        bctx.strokeStyle = `rgba(201,163,92,${(1-d/130)*.35})`;
        bctx.lineWidth=1;
        bctx.beginPath(); bctx.moveTo(nodes[i].x,nodes[i].y); bctx.lineTo(nodes[j].x,nodes[j].y); bctx.stroke();
      }
    }
  }
  for(const n of nodes){ bctx.beginPath(); bctx.arc(n.x,n.y,1.4,0,7); bctx.fill(); }
  requestAnimationFrame(drawBg);
}
drawBg();

/* ---------- card canvas ---------- */
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
let photoImg = null;

function flagEmoji(cc){
  if(!cc || cc.length!==2) return null;
  const A = 0x1F1E6;
  const cps = [...cc.toUpperCase()].map(c => A + (c.charCodeAt(0)-65));
  if(cps.some(cp=>cp<A||cp>A+25)) return null;
  return String.fromCodePoint(...cps);
}

function wrapInitials(name){
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if(!parts.length) return 'A';
  return (parts[0][0] + (parts[1]?parts[1][0]:'')).toUpperCase();
}

function drawCard(){
  const name = document.getElementById('fName').value.trim() || 'Nama Anggota';
  const city = document.getElementById('fCity').value.trim();
  const country = document.getElementById('fCountry').value.trim();
  const chapter = document.getElementById('fChapter').value;
  const flagCode = document.getElementById('fFlag').value.trim();

  // background
  const bgGrad = ctx.createLinearGradient(0,0,W,H);
  bgGrad.addColorStop(0,'#150e28');
  bgGrad.addColorStop(.55,'#1e1438');
  bgGrad.addColorStop(1,'#241a42');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0,0,W,H);

  // radial glow
  const glow = ctx.createRadialGradient(W*0.72,H*0.35,20,W*0.72,H*0.35,600);
  glow.addColorStop(0,'rgba(122,95,212,.28)');
  glow.addColorStop(1,'rgba(122,95,212,0)');
  ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);

  // constellation network (static, seeded)
  ctx.save();
  ctx.globalAlpha = .5;
  const pts = [];
  let seed = 42;
  function rnd(){ seed = (seed*9301+49297)%233280; return seed/233280; }
  for(let i=0;i<46;i++) pts.push({x: rnd()*W, y: rnd()*H*0.7});
  ctx.strokeStyle = 'rgba(201,163,92,.22)';
  ctx.lineWidth = 1;
  for(let i=0;i<pts.length;i++){
    for(let j=i+1;j<pts.length;j++){
      const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
      if(d<140){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
    }
  }
  ctx.fillStyle = 'rgba(242,234,217,.7)';
  for(const p of pts){ ctx.beginPath(); ctx.arc(p.x,p.y,1.6,0,7); ctx.fill(); }
  ctx.restore();

  // top rule + eyebrow
  ctx.strokeStyle = 'rgba(201,163,92,.35)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0,44); ctx.lineTo(W,44); ctx.stroke();
  ctx.fillStyle = '#8a744a';
  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ARCHITECTS  ·  BUILDERS  ·  COMMUNITY  ·  IMPACT', W/2, 28);

  // left: logo + wordmark
  ctx.save();
  ctx.translate(60,90);
  const lg = ctx.createLinearGradient(0,0,60,60);
  lg.addColorStop(0,'#c9a35c'); lg.addColorStop(1,'#7a5fd4');
  ctx.strokeStyle = lg; ctx.lineWidth = 7; ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(30,4); ctx.lineTo(56,58); ctx.lineTo(42,58); ctx.lineTo(30,32); ctx.lineTo(18,58); ctx.lineTo(4,58); ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = '#f2ead9';
  ctx.font = '700 34px "Cormorant Garamond", serif';
  ctx.textAlign = 'left';
  ctx.fillText('Arc', 72, 42);
  ctx.restore();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f2ead9';
  ctx.font = '600 52px "Cormorant Garamond", serif';
  wrapText('BUILDING', 60, 210, 46);
  ctx.save();
  const goldFill = ctx.createLinearGradient(60,0,420,0);
  goldFill.addColorStop(0,'#e9c583'); goldFill.addColorStop(1,'#b5793f');
  ctx.fillStyle = goldFill;
  ctx.fillText('THE FUTURE', 60, 262);
  ctx.restore();
  ctx.fillStyle = '#f2ead9';
  ctx.fillText('TOGETHER', 60, 314);

  ctx.font = '400 16px "Inter", sans-serif';
  ctx.fillStyle = '#a89ecb';
  ctx.fillText('Global Builders, Local Chapters.', 60, 366);
  ctx.fillText('One Architecture. ' , 60, 390);
  ctx.fillStyle = '#c9a35c';
  const w1 = ctx.measureText('One Architecture. ').width;
  ctx.fillText('One Future.', 60+w1, 390);

  function wrapText(t,x,y){ ctx.fillText(t,x,y); }

  // divider between hero copy and card
  ctx.strokeStyle = 'rgba(201,163,92,.25)';
  ctx.beginPath(); ctx.moveTo(0,H-84); ctx.lineTo(W,H-84); ctx.stroke();

  // chapter strip bottom-left
  ctx.fillStyle = '#a89ecb';
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillText('CHAPTERS AROUND THE WORLD', 60, H-42);
  ctx.fillStyle = '#c9a35c';
  ctx.font = '600 14px "Inter", sans-serif';
  ctx.fillText(chapter.toUpperCase(), 60, H-18);

  /* ---- member card, right side ---- */
  const cardX = W-560, cardY = 74, cardW = 500, cardH = H-84-cardY-24;
  ctx.save();
  roundRect(cardX, cardY, cardW, cardH, 16);
  const cardGrad = ctx.createLinearGradient(cardX,cardY,cardX,cardY+cardH);
  cardGrad.addColorStop(0,'rgba(255,255,255,.06)');
  cardGrad.addColorStop(1,'rgba(255,255,255,.015)');
  ctx.fillStyle = cardGrad; ctx.fill();
  ctx.strokeStyle = 'rgba(201,163,92,.4)'; ctx.lineWidth = 1.5; ctx.stroke();
  // corner accent
  ctx.strokeStyle = '#c9a35c'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cardX, cardY+30); ctx.lineTo(cardX, cardY); ctx.lineTo(cardX+30, cardY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cardX+cardW-30, cardY+cardH); ctx.lineTo(cardX+cardW, cardY+cardH); ctx.lineTo(cardX+cardW, cardY+cardH-30); ctx.stroke();
  ctx.restore();

  // photo / avatar circle
  const avR = 74, avCX = cardX+40+avR, avCY = cardY+40+avR;
  ctx.save();
  ctx.beginPath(); ctx.arc(avCX,avCY,avR,0,7); ctx.closePath();
  ctx.strokeStyle = '#c9a35c'; ctx.lineWidth = 3; ctx.stroke();
  ctx.clip();
  if(photoImg){
    drawImageCover(photoImg, avCX-avR, avCY-avR, avR*2, avR*2);
  } else {
    ctx.fillStyle = '#2a1d4d'; ctx.fillRect(avCX-avR,avCY-avR,avR*2,avR*2);
    ctx.fillStyle = '#c9a35c';
    ctx.font = '600 46px "Cormorant Garamond", serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(wrapInitials(name), avCX, avCY+4);
    ctx.textBaseline='alphabetic';
  }
  ctx.restore();

  // name + location beside avatar
  ctx.textAlign = 'left';
  const flag = flagEmoji(flagCode);
  let nameX = avCX+avR+30, nameY = cardY+58;
  if(flag){
    ctx.font = '32px sans-serif';
    ctx.fillText(flag, nameX, nameY+4);
    nameX += 46;
  }
  ctx.fillStyle = '#f2ead9';
  ctx.font = '700 30px "Inter", sans-serif';
  ctx.fillText(truncate(name.toUpperCase(), 16), nameX, nameY+8);

  ctx.font = '500 16px "Inter", sans-serif';
  ctx.fillStyle = '#a89ecb';
  const loc = [city,country].filter(Boolean).join(', ') || 'Chapter Member';
  ctx.fillText(loc.toUpperCase(), avCX+avR+30 + (flag?46:0), cardY+92);

  // divider line inside card
  ctx.strokeStyle = 'rgba(201,163,92,.25)';
  ctx.beginPath(); ctx.moveTo(cardX+40, cardY+150); ctx.lineTo(cardX+cardW-40, cardY+150); ctx.stroke();

  // member id row
  ctx.fillStyle = '#8a744a';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText('MEMBER ID', cardX+40, cardY+182);
  ctx.fillStyle = '#f2ead9';
  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.fillText(genId(name, chapter), cardX+40, cardY+204);

  ctx.fillStyle = '#8a744a';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText('CHAPTER', cardX+280, cardY+182);
  ctx.fillStyle = '#f2ead9';
  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.fillText(truncate(chapter,18), cardX+280, cardY+204);

  // status pill
  ctx.save();
  const pillY = cardY+cardH-56;
  roundRect(cardX+40, pillY, 150, 32, 16);
  ctx.fillStyle = 'rgba(201,163,92,.15)'; ctx.fill();
  ctx.strokeStyle = '#c9a35c'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle = '#c9a35c';
  ctx.font = '600 12px "Inter", sans-serif';
  ctx.textAlign='center';
  ctx.fillText('VERIFIED BUILDER', cardX+115, pillY+21);
  ctx.restore();

  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }
  function truncate(s,n){ return s.length>n ? s.slice(0,n-1)+'…' : s; }
  function genId(n,c){
    let h=0; const str=n+c;
    for(let i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) >>> 0; }
    return 'ARC-' + (h % 90000 + 10000);
  }
  function drawImageCover(img,x,y,w,h){
    const ir = img.width/img.height, tr = w/h;
    let sx,sy,sw,sh;
    if(ir>tr){ sh=img.height; sw=sh*tr; sy=0; sx=(img.width-sw)/2; }
    else{ sw=img.width; sh=sw/tr; sx=0; sy=(img.height-sh)/2; }
    ctx.drawImage(img, sx,sy,sw,sh, x,y,w,h);
  }
}

document.querySelectorAll('#fName,#fCity,#fCountry,#fChapter,#fFlag').forEach(el=>{
  el.addEventListener('input', () => { try{drawCard();}catch(e){} });
  el.addEventListener('change', () => { try{drawCard();}catch(e){} });
});

document.getElementById('fPhoto').addEventListener('change', function(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    const img = new Image();
    img.onload = function(){
      photoImg = img;
      const drop = document.getElementById('photoDrop');
      drop.classList.add('has-img');
      drop.innerHTML = `<img src="${ev.target.result}" alt="preview"><input type="file" id="fPhoto2" style="display:none">`;
      drawCard();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('resetPhotoBtn').addEventListener('click', function(){
  photoImg = null;
  const drop = document.getElementById('photoDrop');
  drop.classList.remove('has-img');
  drop.innerHTML = `<span id="photoDropText">Klik atau tarik foto ke sini</span><input type="file" id="fPhoto" accept="image/*">`;
  document.getElementById('fPhoto').addEventListener('change', arguments.callee.caller);
  drawCard();
});

document.getElementById('downloadBtn').addEventListener('click', function(){
  const link = document.createElement('a');
  const name = (document.getElementById('fName').value.trim() || 'member').replace(/\s+/g,'-').toLowerCase();
  link.download = `arc-member-${name}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// wait for fonts before first draw
document.fonts.ready.then(drawCard);
setTimeout(drawCard, 300);
</script>
</body>
</html>
