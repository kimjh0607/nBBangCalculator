(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();function N(e,t){const a={};e.forEach(o=>{a[o.id]=0});const n={};e.forEach(o=>{n[o.id]={},t.forEach(u=>{n[o.id][u.id]=null})});const s={};e.forEach(o=>{s[o.id]=[]}),t.forEach(o=>{const u=e.filter(l=>o.participantIds.includes(l.id));if(u.length===0)return;let d={};if(o.splitDrink){const l=o.foodAmount||0,p=o.drinkAmount||0,g=o.beverageAmount||0,f=o.drinkerIds||[],I=o.beveragerIds||[],_=o.noFoodIds||[],x=u.filter(k=>!_.includes(k.id)).length,w=u.filter(k=>f.includes(k.id)).length,B=u.filter(k=>I.includes(k.id)).length,L=x>0?l/x:0,C=w>0?p/w:0,T=B>0?g/B:0;u.forEach(k=>{let E=0;_.includes(k.id)||(E+=L),f.includes(k.id)?E+=C:I.includes(k.id)&&(E+=T),d[k.id]=E})}else{const l=o.totalAmount||0,p=u.length>0?l/u.length:0;u.forEach(g=>{d[g.id]=p})}Object.keys(d).forEach(l=>{d[l]=A(d[l])}),u.forEach(l=>{n[l.id][o.id]=d[l.id]});const m=o.splitDrink?(o.foodAmount||0)+(o.drinkAmount||0)+(o.beverageAmount||0):o.totalAmount||0;u.forEach(l=>{l.id===o.payerId?a[l.id]+=m-d[l.id]:a[l.id]-=d[l.id]})}),e.forEach(o=>{const u=t.filter(f=>f.splitDrink&&f.participantIds.includes(o.id));if(u.length===0)return;const d=[],m=[],l=[],p=[];u.forEach(f=>{const I=(f.drinkerIds||[]).includes(o.id),_=(f.beveragerIds||[]).includes(o.id),x=(f.noFoodIds||[]).includes(o.id);x&&!I&&!_?d.push(f):_?m.push(f):!I&&!_?l.push(f):I&&x&&p.push(f)});const g=(f,I,_)=>_?I:`${f.map(x=>x.name||`${x.id}차`).join("·")} ${I}`;d.length>0&&s[o.id].push(g(d,"참석만",d.length===u.length)),m.length>0&&s[o.id].push(g(m,"음료",m.length===u.length)),l.length>0&&s[o.id].push(g(l,"비음주",l.length===u.length)),p.length>0&&s[o.id].push(g(p,"음식X",p.length===u.length))});const r={};e.forEach(o=>{let u=0;t.forEach(d=>{const m=n[o.id][d.id];m!==null&&(u+=m)}),r[o.id]=u});const c=F(a,e);return{matrix:n,totals:r,notes:s,transfers:c}}function F(e,t){const a=[],n={};t.forEach(c=>{n[c.id]=c.name});let s=[],r=[];for(Object.keys(e).forEach(c=>{const o=A(e[c]);o>0?s.push({id:c,amount:o}):o<0&&r.push({id:c,amount:Math.abs(o)})}),s.sort((c,o)=>o.amount-c.amount),r.sort((c,o)=>o.amount-c.amount);s.length>0&&r.length>0;){const c=s[0],o=r[0],u=Math.min(c.amount,o.amount);u>0&&a.push({from:n[o.id],fromId:o.id,to:n[c.id],toId:c.id,amount:A(u)}),c.amount-=u,o.amount-=u,c.amount<=0&&s.shift(),o.amount<=0&&r.shift()}return a}function A(e){return Math.round(e/100)*100}function y(e){return e==null?"-":e.toLocaleString("ko-KR")+"원"}function S(e,t,a,n={}){const{transfers:s}=a,r=[],c=t.filter(d=>(d.receiptItems||[]).some(m=>m.name||m.unitPrice>0));c.length>0&&(r.push("🧾 영수증 내역"),c.forEach(d=>{const m=(d.receiptItems||[]).filter(p=>p.name||p.unitPrice>0);r.push(`
📍 ${d.name}`),m.forEach(p=>{const g=(p.quantity||0)*(p.unitPrice||0);r.push(`  ${p.name||"(항목)"} × ${p.quantity||0} = ${y(g)}`)});const l=m.reduce((p,g)=>p+(g.quantity||0)*(g.unitPrice||0),0);l>0&&r.push(`  소계: ${y(l)}`)}),r.push(""),r.push("─────────────────"),r.push("")),r.push("🧾 차수별 내역");let o=0;return t.forEach(d=>{const m=d.participantIds.length,l=d.splitDrink?(d.foodAmount||0)+(d.drinkAmount||0)+(d.beverageAmount||0):d.totalAmount||0;if(l===0)return;o+=l;const p=e.find(f=>f.id===d.payerId),g=p?` · ${p.name} 결제`:"";r.push(`${d.name}: ${y(l)} (${m}명${g})`)}),t.length>1&&r.push(`총 합계: ${y(o)}`),r.push(""),r.push("─────────────────"),s.length===0?(r.push("✅ 모두 정산 완료!"),r.join(`
`)):(r.push("💸 송금 안내"),[...new Set(s.map(d=>d.toId))].forEach(d=>{const m=e.find(p=>p.id===d);if(!m)return;const l=n[d]||"";r.push(""),r.push(`📌 ${m.name}에게 보내주세요`),l.trim()&&r.push(`💳 ${l.trim()}`),s.filter(p=>p.toId===d).forEach(p=>{r.push(`  ${p.from} → ${y(p.amount)}`)})}),r.join(`
`))}let i={meetingName:"",meetingDate:new Date().toISOString().split("T")[0],payerBankInfos:{},participants:[],rounds:[],result:null,nextParticipantId:1,nextRoundId:1},P=!1;function O(){return`p${i.nextParticipantId++}`}function q(){return i.nextRoundId++}function v(){try{localStorage.setItem("splitEasy_state",JSON.stringify(i))}catch{}}function j(){try{const e=localStorage.getItem("splitEasy_state");if(e){const t=JSON.parse(e);i={...i,...t}}}catch{}}function H(){localStorage.removeItem("splitEasy_state"),i={meetingName:"",meetingDate:new Date().toISOString().split("T")[0],payerBankInfos:{},participants:[],rounds:[],result:null,nextParticipantId:1,nextRoundId:1},h()}function $(e,t="success"){const a=document.getElementById("toast-container"),n=document.createElement("div");n.className=`toast toast--${t}`,n.innerHTML=`
    <i data-lucide="${t==="success"?"check-circle":"info"}"></i>
    <span>${e}</span>
  `,a.appendChild(n),lucide.createIcons({nodes:[n]}),setTimeout(()=>{n.style.animation="toastOut 300ms ease-out forwards",setTimeout(()=>n.remove(),300)},2e3)}function R(){const t=document.getElementById("participant-input").value.trim();if(t){if(i.participants.some(a=>a.name===t)){$("이미 추가된 이름입니다","info");return}i.participants.push({id:O(),name:t}),i.result=null,v(),h(),document.getElementById("participant-input").focus()}}function M(e){i.participants=i.participants.filter(t=>t.id!==e),i.rounds.forEach(t=>{t.participantIds=t.participantIds.filter(a=>a!==e),t.drinkerIds=(t.drinkerIds||[]).filter(a=>a!==e),t.beveragerIds=(t.beveragerIds||[]).filter(a=>a!==e),t.noFoodIds=(t.noFoodIds||[]).filter(a=>a!==e),t.payerId===e&&(t.payerId=null)}),i.result=null,v(),h()}function z(e,t){const a=i.rounds.find(r=>r.id===e);if(!a)return;a.drinkerIds||(a.drinkerIds=[]),a.beveragerIds||(a.beveragerIds=[]);const n=a.drinkerIds.includes(t),s=a.beveragerIds.includes(t);n?(a.drinkerIds=a.drinkerIds.filter(r=>r!==t),a.beveragerIds.push(t)):s?a.beveragerIds=a.beveragerIds.filter(r=>r!==t):a.drinkerIds.push(t),i.result=null,v(),h()}function U(){const e=q(),t=i.rounds.length+1,a=i.rounds[i.rounds.length-1],n=a?[...a.participantIds]:i.participants.map(s=>s.id);i.rounds.push({id:e,name:`${t}차`,totalAmount:0,foodAmount:0,drinkAmount:0,beverageAmount:0,splitDrink:!1,payerId:i.participants.length>0?i.participants[0].id:null,participantIds:n,drinkerIds:[...n],beveragerIds:[],receiptItems:[],nextReceiptItemId:1,noFoodIds:[]}),i.result=null,v(),h(),setTimeout(()=>{const s=document.querySelectorAll(".round-card"),r=s[s.length-1];r&&r.scrollIntoView({behavior:"smooth",block:"center"})},100)}function X(e,t){const a=i.rounds.find(s=>s.id===e);if(!a)return;a.noFoodIds||(a.noFoodIds=[]);const n=a.noFoodIds.indexOf(t);n>=0?a.noFoodIds.splice(n,1):a.noFoodIds.push(t),i.result=null,v(),h()}function J(e){const t=i.rounds.find(a=>a.id===e);t&&(t.receiptItems||(t.receiptItems=[]),t.nextReceiptItemId||(t.nextReceiptItemId=1),t.receiptItems.push({id:t.nextReceiptItemId++,name:"",quantity:1,unitPrice:0}),v(),h())}function K(e,t){const a=i.rounds.find(n=>n.id===e);a&&(a.receiptItems=(a.receiptItems||[]).filter(n=>n.id!==parseInt(t)),v(),h())}function V(e,t,a,n){const s=i.rounds.find(c=>c.id===e);if(!s)return;const r=(s.receiptItems||[]).find(c=>c.id===parseInt(t));r&&(a==="quantity"||a==="unitPrice"?r[a]=parseInt(n)||0:r[a]=n,v())}function W(e){i.rounds=i.rounds.filter(t=>t.id!==e),i.result=null,v(),h()}function D(e,t,a){const n=i.rounds.find(s=>s.id===e);n&&(t==="totalAmount"||t==="foodAmount"||t==="drinkAmount"||t==="beverageAmount"?n[t]=parseInt(a)||0:t==="splitDrink"?(n[t]=a,a&&n.totalAmount>0&&n.foodAmount===0?(n.foodAmount=n.totalAmount,n.totalAmount=0):!a&&n.foodAmount>0&&(n.totalAmount=n.foodAmount+n.drinkAmount,n.foodAmount=0,n.drinkAmount=0)):n[t]=a,i.result=null,v(),h())}function G(e,t){const a=i.rounds.find(s=>s.id===e);if(!a)return;const n=a.participantIds.indexOf(t);n>=0?a.participantIds.splice(n,1):a.participantIds.push(t),i.result=null,v(),h()}function Q(){if(i.participants.length===0){$("참여자를 추가해주세요","info");return}if(i.rounds.length===0){$("차수를 추가해주세요","info");return}i.result=N(i.participants,i.rounds),v(),h(),setTimeout(()=>{const e=document.getElementById("result-section");e&&e.scrollIntoView({behavior:"smooth",block:"start"})},100)}function Y(){if(!i.result)return;const e=S(i.participants,i.rounds,i.result,i.payerBankInfos),t=i.meetingName?`📋 [${i.meetingName}] 정산 결과  ${i.meetingDate}

`:"";navigator.clipboard.writeText(t+e).then(()=>{$("클립보드에 복사되었습니다!")}).catch(()=>{const a=document.createElement("textarea");a.value=t+e,document.body.appendChild(a),a.select(),document.execCommand("copy"),a.remove(),$("클립보드에 복사되었습니다!")})}async function Z(){if(!i.result)return;const e=S(i.participants,i.rounds,i.result,i.payerBankInfos),a=(i.meetingName?`📋 [${i.meetingName}] 정산 결과  ${i.meetingDate}

`:`📋 정산 결과  ${i.meetingDate}

`)+e,n=document.getElementById("share-result-btn"),s=n?.innerHTML;n&&(n.disabled=!0,n.innerHTML='<i data-lucide="loader-circle" style="width:16px;height:16px;animation:spin 1s linear infinite"></i> 준비 중...',lucide.createIcons({nodes:[n]}));let r=null;if(typeof html2canvas<"u"){const c=document.createElement("div");c.style.cssText="position:fixed;top:-9999px;left:-9999px;padding:24px;background:#0d1117;min-width:360px;";try{const o=document.getElementById("receipt-summary-section"),u=document.getElementById("result-section");if(await document.fonts.ready,o){const l=o.cloneNode(!0);l.style.animation="none",c.appendChild(l)}const d=u.cloneNode(!0);d.style.animation="none",c.appendChild(d),document.body.appendChild(c);const m=await html2canvas(c,{backgroundColor:"#0d1117",scale:2,useCORS:!0,logging:!1});r=await new Promise(l=>m.toBlob(l,"image/png"))}catch{}finally{c.parentNode&&document.body.removeChild(c)}}try{if(r){const c=new File([r],"정산결과.png",{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[c]}))await navigator.share({files:[c],text:a});else try{await navigator.clipboard.write([new ClipboardItem({"image/png":r})]),$("이미지가 클립보드에 복사됐어요! 채팅창에 붙여넣기하세요.")}catch{const u=URL.createObjectURL(r),d=document.createElement("a");d.href=u,d.download="정산결과.png",d.click(),URL.revokeObjectURL(u),navigator.clipboard.writeText(a).catch(()=>{}),$("이미지 저장됨! 채팅창에 파일로 첨부해주세요.")}}else navigator.share?await navigator.share({text:a}):(await navigator.clipboard.writeText(a),$("클립보드에 복사되었습니다!"))}catch(c){c?.name!=="AbortError"&&$("공유에 실패했어요. 복사 버튼을 이용해주세요.","info")}finally{n&&s&&(n.disabled=!1,n.innerHTML=s,lucide.createIcons({nodes:[n]}))}}function h(){const e=document.getElementById("app");e.innerHTML=`
    ${tt()}
    ${et()}
    ${at()}
    ${st()}
    ${nt()}
    ${dt()}
    ${i.result?ot():""}
    ${i.result?ct():""}
  `,lt(),lucide.createIcons({nodes:[e]})}function tt(){return`
    <header class="header">
      <h1 class="header__logo">nBBangCalculator</h1>
      <p class="header__sub">모임 정산, 5분이면 끝</p>
      <button class="btn btn--danger btn--sm header__reset" id="reset-btn">
        <i data-lucide="rotate-ccw"></i>
        초기화
      </button>
    </header>
    <div class="guide-steps">
      <div class="guide-step">
        <span class="guide-step__num">1</span>
        <span class="guide-step__label">참여자<br>추가</span>
      </div>
      <i data-lucide="chevron-right" class="guide-step__arrow"></i>
      <div class="guide-step">
        <span class="guide-step__num">2</span>
        <span class="guide-step__label">차수별<br>금액 입력</span>
      </div>
      <i data-lucide="chevron-right" class="guide-step__arrow"></i>
      <div class="guide-step">
        <span class="guide-step__num">3</span>
        <span class="guide-step__label">정산하기<br>클릭</span>
      </div>
    </div>
  `}function et(){return`
    <section class="section" style="animation-delay: 0.05s">
      <div class="section__title">
        <i data-lucide="calendar"></i>
        <span>모임 정보</span>
      </div>
      <div class="card">
        <div class="input-field">
          <label>모임 이름</label>
          <input type="text" id="meeting-name" placeholder="예: 팀 회식"
                 value="${b(i.meetingName)}" />
        </div>
        <div class="input-field mt-3">
          <label>날짜</label>
          <input type="date" id="meeting-date" value="${i.meetingDate}" />
        </div>
      </div>
    </section>
  `}function nt(){const e=[...new Set(i.rounds.map(a=>a.payerId).filter(Boolean))];return e.length===0?"":`
    <section class="section" style="animation-delay: 0.08s">
      <div class="section__title">
        <i data-lucide="credit-card"></i>
        <span>결제자 계좌</span>
        <span class="text-muted text-sm">(선택)</span>
      </div>
      <div class="card">
        <p class="text-muted text-sm mb-2">입력하면 정산 결과 공유 시 계좌번호가 함께 전송돼요.<br><span style="color:var(--text-tertiary)">건너뛰어도 정산 계산에는 영향 없어요.</span></p>
        ${e.map(a=>{const n=i.participants.find(s=>s.id===a);return n?`
      <div class="input-field mt-3">
        <label>💳 ${b(n.name)} 계좌</label>
        <input type="text"
               data-action="update-payer-bank" data-payer="${a}"
               value="${b(i.payerBankInfos[a]||"")}"
               placeholder="은행명 ****-**-**** ${b(n.name)}" />
      </div>
    `:""}).join("")}
      </div>
    </section>
  `}function at(){const e=i.participants.map(t=>`
    <div class="chip" data-id="${t.id}">
      <span>${b(t.name)}</span>
      <button class="chip__remove" data-action="remove-participant" data-id="${t.id}" title="삭제">×</button>
    </div>
  `).join("");return`
    <section class="section" style="animation-delay: 0.1s">
      <div class="section__title">
        <i data-lucide="users"></i>
        <span>참여자</span>
        ${i.participants.length>0?`<span class="text-muted text-sm">(${i.participants.length}명)</span>`:""}
      </div>
      <div class="card">
        <p class="text-muted text-sm mb-2">오늘 모임에 참여한 사람을 모두 추가하세요.<br><span style="color:var(--text-tertiary)">차수마다 빠진 사람이 있어도 괜찮아요. 나중에 체크박스로 조정할 수 있어요.</span></p>
        <div class="input-group">
          <input type="text" id="participant-input"
                 placeholder="이름을 입력하고 Enter"
                 style="flex:1" />
          <button class="btn btn--primary btn--sm" id="add-participant-btn">
            <i data-lucide="plus"></i>
            추가
          </button>
        </div>
        ${i.participants.length>0?`
          <div class="chip-list">${e}</div>
        `:`
          <div class="empty-state mt-3">
            <div class="empty-state__icon">👥</div>
            <p>참여자를 추가해주세요</p>
          </div>
        `}
      </div>
    </section>
  `}function st(){const e=i.rounds.map((a,n)=>it(a,n)).join("");return`
    <section class="section" style="animation-delay: 0.15s">
      <div class="section__title">
        <i data-lucide="receipt"></i>
        <span>차수별 지출</span>
      </div>
      ${i.rounds.length===0?`
    <div class="card round-empty-state">
      <div class="empty-state__icon">🧾</div>
      <p style="font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-1)">아직 추가된 차수가 없어요</p>
      <p class="text-sm text-muted">1차 식당, 2차 술집처럼<br>자리가 바뀔 때마다 차수를 추가하세요.<br>한 곳만 갔다면 1차만 추가하면 돼요.</p>
    </div>
  `:""}
      ${e}
      <button class="btn btn--secondary btn--full" id="add-round-btn"
              ${i.participants.length===0?'disabled style="opacity:0.5;cursor:not-allowed"':""}>
        <i data-lucide="plus-circle"></i>
        차수 추가
      </button>
      ${i.participants.length===0?'<p class="text-muted text-sm" style="text-align:center;margin-top:var(--space-2)">참여자를 먼저 추가해야 차수를 추가할 수 있어요</p>':""}
    </section>
  `}function it(e,t){const a=e.drinkerIds||[],n=e.beveragerIds||[],s=e.noFoodIds||[],r=i.participants.map(d=>{const m=e.participantIds.includes(d.id),l=a.includes(d.id),p=n.includes(d.id),g=l?"drinker":p?"beverage":"sober",f=l?"🍺":p?"🥤":"🚫",I=l?"음주":p?"음료":"없음";return`
      <label class="check-item ${m?"check-item--checked":""}"
             data-action="toggle-round-participant"
             data-round="${e.id}" data-participant="${d.id}">
        <input type="checkbox" ${m?"checked":""} />
        <span class="check-item__box">
          <svg viewBox="0 0 14 14"><polyline points="2 7 5.5 10.5 12 4"></polyline></svg>
        </span>
        <span>${b(d.name)}</span>
        ${e.splitDrink&&m?`
          <span class="food-toggle ${s.includes(d.id)?"food-toggle--nofood":"food-toggle--food"}"
                data-action="toggle-food"
                data-round="${e.id}" data-participant="${d.id}"
                title="클릭해서 식사 여부 변경">
            ${s.includes(d.id)?"🙅 식사X":"🍽️ 식사"}
          </span>
          <span class="drink-toggle drink-toggle--${g}"
                data-action="cycle-round-drink"
                data-round="${e.id}" data-participant="${d.id}"
                title="클릭해서 변경">
            ${f} ${I}
          </span>
        `:""}
      </label>
    `}).join(""),c=i.participants.map(d=>`<option value="${d.id}" ${e.payerId===d.id?"selected":""}>${b(d.name)}</option>`).join(""),o=e.splitDrink?`
      <div class="split-input">
        <div class="input-field">
          <label>🍔 음식값</label>
          <input type="number" data-action="update-round" data-round="${e.id}" data-field="foodAmount"
                 value="${e.foodAmount||""}" placeholder="0" inputmode="numeric" />
        </div>
        <div class="input-field">
          <label>🍺 술값</label>
          <input type="number" data-action="update-round" data-round="${e.id}" data-field="drinkAmount"
                 value="${e.drinkAmount||""}" placeholder="0" inputmode="numeric" />
        </div>
        <div class="input-field">
          <label>🥤 음료값</label>
          <input type="number" data-action="update-round" data-round="${e.id}" data-field="beverageAmount"
                 value="${e.beverageAmount||""}" placeholder="0" inputmode="numeric" />
        </div>
      </div>
    `:`
      <div class="input-field">
        <label>총 금액</label>
        <input type="number" data-action="update-round" data-round="${e.id}" data-field="totalAmount"
               value="${e.totalAmount||""}" placeholder="0" inputmode="numeric" />
      </div>
    `,u=e.splitDrink?'<p class="text-muted text-sm mt-2" style="padding-left:2px"><span style="color:var(--text-tertiary);font-size:var(--font-size-xs)">🍽️/🙅 클릭: 식사 여부 · 🍺/🥤/🚫 클릭: 음주 종류 변경</span></p>':"";return`
    <div class="round-card" style="animation-delay: ${.05*t}s">
      <div class="round-card__header">
        <div class="round-card__title">
          <span class="round-card__number">${t+1}</span>
          <input type="text" value="${b(e.name)}"
                 data-action="update-round" data-round="${e.id}" data-field="name"
                 style="background:transparent;border:none;color:var(--text-primary);font-size:var(--font-size-lg);font-weight:700;font-family:var(--font-family);width:100px;padding:0" />
        </div>
        <button class="round-card__delete" data-action="remove-round" data-round="${e.id}" title="삭제">
          <i data-lucide="trash-2" style="width:16px;height:16px"></i>
        </button>
      </div>

      <div class="round-card__body">
        <div>
          <div>
            <div class="round-card__field-label">💳 결제자</div>
            <p class="text-muted text-sm" style="margin-bottom:var(--space-2)">이 자리에서 <strong style="color:var(--text-secondary)">실제로 카드·현금으로 계산한 사람</strong>을 선택하세요</p>
            <select data-action="update-round" data-round="${e.id}" data-field="payerId">
              ${c}
            </select>
          </div>
        </div>

        <div>
          <div class="flex-between mb-2">
            <span class="round-card__field-label" style="margin-bottom:0">금액</span>
            <label class="toggle-wrap">
              <span class="toggle-wrap__label" title="술을 안 마시는 사람과 따로 계산하고 싶을 때 켜세요">음주/비음주 구분 <span style="font-size:var(--font-size-xs);color:var(--text-tertiary)">(?)</span></span>
              <span class="toggle">
                <input type="checkbox" ${e.splitDrink?"checked":""}
                       data-action="toggle-split-drink" data-round="${e.id}" />
                <span class="toggle__slider"></span>
              </span>
            </label>
          </div>
          ${e.splitDrink?'<p class="text-muted text-sm" style="margin-bottom:var(--space-2)">음식·술·음료값을 따로 입력하면 음주 여부에 따라 나눠서 계산해요</p>':'<p class="text-muted text-sm" style="margin-bottom:var(--space-2)">총 금액을 입력하면 참여자 수로 자동 1/N 계산해요</p>'}
          ${o}
        </div>

        <div>
          <div class="round-card__field-label">참여자</div>
          <p class="text-muted text-sm" style="margin-bottom:var(--space-2)">${e.splitDrink?"이 차수에 함께한 사람을 체크하고, 옆 아이콘을 눌러 음주 여부를 설정하세요":"이 차수에 함께한 사람만 체크하세요"}</p>
          <div class="check-group">
            ${r}
          </div>
          ${u}
        </div>

        ${rt(e)}
      </div>
    </div>
  `}function rt(e){const t=e.receiptItems||[],a=t.map(s=>{const r=(s.quantity||0)*(s.unitPrice||0);return`
      <div class="receipt-item-row">
        <input type="text" class="receipt-item__name"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${s.id}" data-field="name"
               value="${b(s.name)}" placeholder="항목명" />
        <input type="number" class="receipt-item__qty"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${s.id}" data-field="quantity"
               value="${s.quantity||""}" placeholder="수량" inputmode="numeric" />
        <input type="number" class="receipt-item__price"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${s.id}" data-field="unitPrice"
               value="${s.unitPrice||""}" placeholder="단가" inputmode="numeric" />
        <span class="receipt-item__total amount">${r>0?y(r):"-"}</span>
        <button class="receipt-item__remove" data-action="remove-receipt-item" data-round="${e.id}" data-item="${s.id}" title="삭제">×</button>
      </div>
    `}).join(""),n=t.reduce((s,r)=>s+(r.quantity||0)*(r.unitPrice||0),0);return`
    <div class="receipt-input-section">
      <div class="receipt-input-section__header">
        <span class="round-card__field-label" style="margin-bottom:0">🧾 영수증 항목 <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-tertiary)">(선택)</span></span>
        <button class="btn btn--secondary btn--sm" data-action="add-receipt-item" data-round="${e.id}">
          <i data-lucide="plus" style="width:12px;height:12px"></i> 항목 추가
        </button>
      </div>
      ${t.length===0?'<p class="text-muted text-sm" style="margin-top:var(--space-2)">항목을 추가하면 공유 시 영수증 내역이 함께 전송돼요.</p>':`
          <div class="receipt-items-header">
            <span>항목명</span><span>수량</span><span>단가</span><span>합계</span><span></span>
          </div>
          <div class="receipt-items-list">${a}</div>
          <div class="receipt-items-subtotal">소계 <strong class="amount">${y(n)}</strong></div>
        `}
    </div>
  `}function ot(){const e=i.rounds.filter(a=>(a.receiptItems||[]).some(n=>n.name||n.unitPrice>0));return e.length===0?"":`
    <section class="section" id="receipt-summary-section" style="animation-delay: 0.05s">
      <div class="section__title">
        <i data-lucide="receipt"></i>
        <span>영수증 내역</span>
      </div>
      <div class="card receipt-summary-card">${e.map(a=>{const n=(a.receiptItems||[]).filter(c=>c.name||c.unitPrice>0),s=n.reduce((c,o)=>c+(o.quantity||0)*(o.unitPrice||0),0),r=n.map(c=>`
      <div class="receipt-summary__row">
        <span class="receipt-summary__name">${b(c.name||"(항목)")}</span>
        <span class="receipt-summary__qty">${c.quantity||0}개</span>
        <span class="receipt-summary__price amount">${y((c.quantity||0)*(c.unitPrice||0))}</span>
      </div>
    `).join("");return`
      <div class="receipt-summary__round">
        <div class="receipt-summary__round-title">${b(a.name)}</div>
        ${r}
        <div class="receipt-summary__subtotal">소계 <strong class="amount">${y(s)}</strong></div>
      </div>
    `}).join("")}</div>
    </section>
  `}function dt(){return`
    <section class="section section--cta" style="animation-delay: 0.2s">
      <button class="btn btn--primary btn--lg btn--full" id="calculate-btn"
              ${i.participants.length>0&&i.rounds.length>0?"":'disabled style="opacity:0.5;cursor:not-allowed"'}>
        <i data-lucide="calculator"></i>
        정산하기
      </button>
    </section>
  `}function ct(){const{matrix:e,totals:t,notes:a}=i.result;let n='<table class="result-table"><thead><tr>';return n+="<th>이름</th>",i.rounds.forEach(s=>{n+=`<th>${b(s.name)}</th>`}),n+="<th>총합</th></tr></thead><tbody>",i.participants.forEach(s=>{n+="<tr>",n+=`<td>${b(s.name)}</td>`,i.rounds.forEach(r=>{const c=e[s.id][r.id],o=r.payerId===s.id,u=ft(r,s.id);c===null?n+='<td class="not-participated">-</td>':o?n+=`<td class="amount payer-cell">${y(c)}<span class="payer-chip">결제</span>${u}</td>`:c===0?n+='<td><span class="attend-only-badge">참석만</span></td>':n+=`<td class="amount">${y(c)}${u}</td>`}),n+=`<td class="total-col amount">${y(t[s.id])}</td>`,n+="</tr>"}),n+="</tbody></table>",`
    <section class="section" id="result-section" style="animation-delay: 0.1s">
      <div class="section__title">
        <i data-lucide="bar-chart-3"></i>
        <span>정산 결과</span>
      </div>
      <div class="result-table-wrap">
        ${n}
      </div>

      <div class="mt-4" style="display:flex;gap:var(--space-2)">
        <button class="btn btn--secondary btn--full" id="copy-result-btn">
          <i data-lucide="clipboard-copy"></i>
          결과 복사
        </button>
        <button class="btn btn--primary btn--full" id="share-result-btn">
          <i data-lucide="share-2"></i>
          공유하기
        </button>
      </div>
    </section>
  `}function lt(){const e=document.getElementById("participant-input");e&&e.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),R())});const t=document.getElementById("add-participant-btn");t&&t.addEventListener("click",R);const a=document.getElementById("add-round-btn");a&&a.addEventListener("click",U);const n=document.getElementById("calculate-btn");n&&n.addEventListener("click",Q);const s=document.getElementById("copy-result-btn");s&&s.addEventListener("click",Y);const r=document.getElementById("share-result-btn");r&&r.addEventListener("click",Z);const c=document.getElementById("reset-btn");c&&c.addEventListener("click",()=>{confirm("모든 데이터를 초기화할까요?")&&H()});const o=document.getElementById("meeting-name");o&&o.addEventListener("input",d=>{i.meetingName=d.target.value,v()});const u=document.getElementById("meeting-date");if(u&&u.addEventListener("input",d=>{i.meetingDate=d.target.value,v()}),!P){const d=document.getElementById("app");d.addEventListener("click",ut),d.addEventListener("change",pt),d.addEventListener("input",mt),d.addEventListener("blur",m=>{m.target.closest('[data-action="update-receipt-item"]')&&h()},!0),P=!0}}function ut(e){const t=e.target.closest("[data-action]");if(!t)return;switch(t.dataset.action){case"remove-participant":M(t.dataset.id);break;case"toggle-food":e.preventDefault(),e.stopPropagation(),X(parseInt(t.dataset.round),t.dataset.participant);break;case"cycle-round-drink":e.preventDefault(),e.stopPropagation(),z(parseInt(t.dataset.round),t.dataset.participant);break;case"toggle-round-participant":e.preventDefault(),G(parseInt(t.dataset.round),t.dataset.participant);break;case"remove-round":W(parseInt(t.dataset.round));break;case"add-receipt-item":J(parseInt(t.dataset.round));break;case"remove-receipt-item":K(parseInt(t.dataset.round),t.dataset.item);break;case"copy-bank":{const n=t.dataset.bank;navigator.clipboard.writeText(n).then(()=>{$("계좌번호 복사됨!")}).catch(()=>{const s=document.createElement("textarea");s.value=n,document.body.appendChild(s),s.select(),document.execCommand("copy"),s.remove(),$("계좌번호 복사됨!")});break}}}function pt(e){const t=e.target.closest("[data-action]");if(!t)return;switch(t.dataset.action){case"toggle-split-drink":D(parseInt(t.dataset.round),"splitDrink",t.checked);break;case"update-round":t.tagName==="SELECT"&&D(parseInt(t.dataset.round),t.dataset.field,t.value);break}}function mt(e){const t=e.target.closest("[data-action]");if(t){if(t.dataset.action==="update-payer-bank"){i.payerBankInfos[t.dataset.payer]=t.value,i.result=null,v();return}if(t.dataset.action==="update-receipt-item"){V(parseInt(t.dataset.round),t.dataset.item,t.dataset.field,t.value);return}if(t.dataset.action==="update-round"){const a=i.rounds.find(s=>s.id===parseInt(t.dataset.round));if(!a)return;const n=t.dataset.field;n==="totalAmount"||n==="foodAmount"||n==="drinkAmount"||n==="beverageAmount"?a[n]=parseInt(t.value)||0:n==="name"&&(a[n]=t.value),i.result=null,v()}}}function ft(e,t){if(!e.splitDrink||!e.participantIds.includes(t))return"";const a=(e.drinkerIds||[]).includes(t),n=(e.beveragerIds||[]).includes(t),s=(e.noFoodIds||[]).includes(t);if(s&&!a&&!n)return"";const r=[];return n?r.push('<span class="cell-status-badge cell-status-badge--beverage">음료</span>'):a||r.push('<span class="cell-status-badge cell-status-badge--sober">비음주</span>'),s&&r.push('<span class="cell-status-badge cell-status-badge--nofood">음식X</span>'),r.length?`<br><span class="cell-status-badges">${r.join("")}</span>`:""}function b(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}j();h();
