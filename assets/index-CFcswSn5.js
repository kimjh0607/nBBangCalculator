(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();function N(e,t){const a={};e.forEach(o=>{a[o.id]=0});const n={};e.forEach(o=>{n[o.id]={},t.forEach(p=>{n[o.id][p.id]=null})});const i={};e.forEach(o=>{i[o.id]=[]}),t.forEach(o=>{const p=e.filter(l=>o.participantIds.includes(l.id));if(p.length===0)return;let d={};if(o.splitDrink){const l=o.foodAmount||0,u=o.drinkAmount||0,g=o.beverageAmount||0,f=o.drinkerIds||[],I=o.beveragerIds||[],x=o.noFoodIds||[],_=p.filter($=>!x.includes($.id)).length,w=p.filter($=>f.includes($.id)).length,B=p.filter($=>I.includes($.id)).length,S=_>0?l/_:0,C=w>0?u/w:0,T=B>0?g/B:0;p.forEach($=>{let E=0;x.includes($.id)||(E+=S),f.includes($.id)?E+=C:I.includes($.id)&&(E+=T),d[$.id]=E})}else{const l=o.totalAmount||0,u=p.length>0?l/p.length:0;p.forEach(g=>{d[g.id]=u})}Object.keys(d).forEach(l=>{d[l]=A(d[l])}),p.forEach(l=>{n[l.id][o.id]=d[l.id]});const m=o.splitDrink?(o.foodAmount||0)+(o.drinkAmount||0)+(o.beverageAmount||0):o.totalAmount||0;p.forEach(l=>{l.id===o.payerId?a[l.id]+=m-d[l.id]:a[l.id]-=d[l.id]})}),e.forEach(o=>{const p=t.filter(f=>f.splitDrink&&f.participantIds.includes(o.id));if(p.length===0)return;const d=[],m=[],l=[],u=[];p.forEach(f=>{const I=(f.drinkerIds||[]).includes(o.id),x=(f.beveragerIds||[]).includes(o.id),_=(f.noFoodIds||[]).includes(o.id);_&&!I&&!x?d.push(f):x?m.push(f):!I&&!x?l.push(f):I&&_&&u.push(f)});const g=(f,I,x)=>x?I:`${f.map(_=>_.name||`${_.id}차`).join("·")} ${I}`;d.length>0&&i[o.id].push(g(d,"참석만",d.length===p.length)),m.length>0&&i[o.id].push(g(m,"음료",m.length===p.length)),l.length>0&&i[o.id].push(g(l,"비음주",l.length===p.length)),u.length>0&&i[o.id].push(g(u,"음식X",u.length===p.length))});const r={};e.forEach(o=>{let p=0;t.forEach(d=>{const m=n[o.id][d.id];m!==null&&(p+=m)}),r[o.id]=p});const c=O(a,e);return{matrix:n,totals:r,notes:i,transfers:c}}function O(e,t){const a=[],n={};t.forEach(c=>{n[c.id]=c.name});let i=[],r=[];for(Object.keys(e).forEach(c=>{const o=A(e[c]);o>0?i.push({id:c,amount:o}):o<0&&r.push({id:c,amount:Math.abs(o)})}),i.sort((c,o)=>o.amount-c.amount),r.sort((c,o)=>o.amount-c.amount);i.length>0&&r.length>0;){const c=i[0],o=r[0],p=Math.min(c.amount,o.amount);p>0&&a.push({from:n[o.id],fromId:o.id,to:n[c.id],toId:c.id,amount:A(p)}),c.amount-=p,o.amount-=p,c.amount<=0&&i.shift(),o.amount<=0&&r.shift()}return a}function A(e){return Math.round(e/100)*100}function y(e){return e==null?"-":e.toLocaleString("ko-KR")+"원"}function L(e,t,a,n={}){const{transfers:i}=a,r=[],c=t.filter(d=>(d.receiptItems||[]).some(m=>m.name||m.unitPrice>0));c.length>0&&(r.push("🧾 영수증 내역"),c.forEach(d=>{const m=(d.receiptItems||[]).filter(u=>u.name||u.unitPrice>0);r.push(`
📍 ${d.name}`),m.forEach(u=>{const g=(u.quantity||0)*(u.unitPrice||0);r.push(`  ${u.name||"(항목)"} × ${u.quantity||0} = ${y(g)}`)});const l=m.reduce((u,g)=>u+(g.quantity||0)*(g.unitPrice||0),0);l>0&&r.push(`  소계: ${y(l)}`)}),r.push(""),r.push("─────────────────"),r.push("")),r.push("🧾 차수별 내역");let o=0;return t.forEach(d=>{const m=d.participantIds.length,l=d.splitDrink?(d.foodAmount||0)+(d.drinkAmount||0)+(d.beverageAmount||0):d.totalAmount||0;if(l===0)return;o+=l;const u=e.find(f=>f.id===d.payerId),g=u?` · ${u.name} 결제`:"";r.push(`${d.name}: ${y(l)} (${m}명${g})`)}),t.length>1&&r.push(`총 합계: ${y(o)}`),r.push(""),r.push("─────────────────"),i.length===0?(r.push("✅ 모두 정산 완료!"),r.join(`
`)):(r.push("💸 송금 안내"),[...new Set(i.map(d=>d.toId))].forEach(d=>{const m=e.find(u=>u.id===d);if(!m)return;const l=n[d]||"";r.push(""),r.push(`📌 ${m.name}에게 보내주세요`),l.trim()&&r.push(`💳 ${l.trim()}`),i.filter(u=>u.toId===d).forEach(u=>{r.push(`  ${u.from} → ${y(u.amount)}`)})}),r.join(`
`))}let s={meetingName:"",meetingDate:new Date().toISOString().split("T")[0],payerBankInfos:{},participants:[],rounds:[],result:null,nextParticipantId:1,nextRoundId:1},P=!1;function F(){return`p${s.nextParticipantId++}`}function q(){return s.nextRoundId++}function v(){try{localStorage.setItem("splitEasy_state",JSON.stringify(s))}catch{}}function j(){try{const e=localStorage.getItem("splitEasy_state");if(e){const t=JSON.parse(e);s={...s,...t}}}catch{}}function H(){localStorage.removeItem("splitEasy_state"),s={meetingName:"",meetingDate:new Date().toISOString().split("T")[0],payerBankInfos:{},participants:[],rounds:[],result:null,nextParticipantId:1,nextRoundId:1},b()}function k(e,t="success"){const a=document.getElementById("toast-container"),n=document.createElement("div");n.className=`toast toast--${t}`,n.innerHTML=`
    <i data-lucide="${t==="success"?"check-circle":"info"}"></i>
    <span>${e}</span>
  `,a.appendChild(n),lucide.createIcons({nodes:[n]}),setTimeout(()=>{n.style.animation="toastOut 300ms ease-out forwards",setTimeout(()=>n.remove(),300)},2e3)}function R(){const t=document.getElementById("participant-input").value.trim();if(t){if(s.participants.some(a=>a.name===t)){k("이미 추가된 이름입니다","info");return}s.participants.push({id:F(),name:t}),s.result=null,v(),b(),document.getElementById("participant-input").focus()}}function M(e){s.participants=s.participants.filter(t=>t.id!==e),s.rounds.forEach(t=>{t.participantIds=t.participantIds.filter(a=>a!==e),t.drinkerIds=(t.drinkerIds||[]).filter(a=>a!==e),t.beveragerIds=(t.beveragerIds||[]).filter(a=>a!==e),t.noFoodIds=(t.noFoodIds||[]).filter(a=>a!==e),t.payerId===e&&(t.payerId=null)}),s.result=null,v(),b()}function z(e,t){const a=s.rounds.find(r=>r.id===e);if(!a)return;a.drinkerIds||(a.drinkerIds=[]),a.beveragerIds||(a.beveragerIds=[]);const n=a.drinkerIds.includes(t),i=a.beveragerIds.includes(t);n?(a.drinkerIds=a.drinkerIds.filter(r=>r!==t),a.beveragerIds.push(t)):i?a.beveragerIds=a.beveragerIds.filter(r=>r!==t):a.drinkerIds.push(t),s.result=null,v(),b()}function U(){const e=q(),t=s.rounds.length+1,a=s.rounds[s.rounds.length-1],n=a?[...a.participantIds]:s.participants.map(i=>i.id);s.rounds.push({id:e,name:`${t}차`,totalAmount:0,foodAmount:0,drinkAmount:0,beverageAmount:0,splitDrink:!1,payerId:s.participants.length>0?s.participants[0].id:null,participantIds:n,drinkerIds:[...n],beveragerIds:[],receiptItems:[],nextReceiptItemId:1,noFoodIds:[]}),s.result=null,v(),b(),setTimeout(()=>{const i=document.querySelectorAll(".round-card"),r=i[i.length-1];r&&r.scrollIntoView({behavior:"smooth",block:"center"})},100)}function J(e,t){const a=s.rounds.find(i=>i.id===e);if(!a)return;a.noFoodIds||(a.noFoodIds=[]);const n=a.noFoodIds.indexOf(t);n>=0?a.noFoodIds.splice(n,1):a.noFoodIds.push(t),s.result=null,v(),b()}function K(e){const t=s.rounds.find(a=>a.id===e);t&&(t.receiptItems||(t.receiptItems=[]),t.nextReceiptItemId||(t.nextReceiptItemId=1),t.receiptItems.push({id:t.nextReceiptItemId++,name:"",quantity:1,unitPrice:0}),v(),b())}function V(e,t){const a=s.rounds.find(n=>n.id===e);a&&(a.receiptItems=(a.receiptItems||[]).filter(n=>n.id!==parseInt(t)),v(),b())}function W(e,t,a,n){const i=s.rounds.find(c=>c.id===e);if(!i)return;const r=(i.receiptItems||[]).find(c=>c.id===parseInt(t));r&&(a==="quantity"||a==="unitPrice"?r[a]=parseInt(n)||0:r[a]=n,v())}function X(e){s.rounds=s.rounds.filter(t=>t.id!==e),s.result=null,v(),b()}function D(e,t,a){const n=s.rounds.find(i=>i.id===e);n&&(t==="totalAmount"||t==="foodAmount"||t==="drinkAmount"||t==="beverageAmount"?n[t]=parseInt(a)||0:t==="splitDrink"?(n[t]=a,a&&n.totalAmount>0&&n.foodAmount===0?(n.foodAmount=n.totalAmount,n.totalAmount=0):!a&&n.foodAmount>0&&(n.totalAmount=n.foodAmount+n.drinkAmount,n.foodAmount=0,n.drinkAmount=0)):n[t]=a,s.result=null,v(),b())}function G(e,t){const a=s.rounds.find(i=>i.id===e);if(!a)return;const n=a.participantIds.indexOf(t);n>=0?a.participantIds.splice(n,1):a.participantIds.push(t),s.result=null,v(),b()}function Q(){if(s.participants.length===0){k("참여자를 추가해주세요","info");return}if(s.rounds.length===0){k("차수를 추가해주세요","info");return}s.result=N(s.participants,s.rounds),v(),b(),setTimeout(()=>{const e=document.getElementById("result-section");e&&e.scrollIntoView({behavior:"smooth",block:"start"})},100)}function Y(){if(!s.result)return;const e=L(s.participants,s.rounds,s.result,s.payerBankInfos),t=s.meetingName?`📋 [${s.meetingName}] 정산 결과  ${s.meetingDate}

`:"";navigator.clipboard.writeText(t+e).then(()=>{k("클립보드에 복사되었습니다!")}).catch(()=>{const a=document.createElement("textarea");a.value=t+e,document.body.appendChild(a),a.select(),document.execCommand("copy"),a.remove(),k("클립보드에 복사되었습니다!")})}async function Z(){if(!s.result)return;const e=L(s.participants,s.rounds,s.result,s.payerBankInfos),a=(s.meetingName?`📋 [${s.meetingName}] 정산 결과  ${s.meetingDate}

`:`📋 정산 결과  ${s.meetingDate}

`)+e,n=document.getElementById("share-result-btn"),i=n?.innerHTML;n&&(n.disabled=!0,n.innerHTML='<i data-lucide="loader-circle" style="width:16px;height:16px;animation:spin 1s linear infinite"></i> 준비 중...',lucide.createIcons({nodes:[n]}));try{const r=document.getElementById("receipt-summary-section"),c=document.getElementById("result-section");await document.fonts.ready;const o=document.createElement("div");if(o.style.cssText="position:fixed;top:-9999px;left:-9999px;padding:24px;background:#0d1117;min-width:360px;",r){const u=r.cloneNode(!0);u.style.animation="none",o.appendChild(u)}const p=c.cloneNode(!0);p.style.animation="none",o.appendChild(p),document.body.appendChild(o);const d=await html2canvas(o,{backgroundColor:"#0d1117",scale:2,useCORS:!0,logging:!1});document.body.removeChild(o);const m=await new Promise(u=>d.toBlob(u,"image/png")),l=new File([m],"정산결과.png",{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[l]}))await navigator.share({files:[l],text:a});else try{await navigator.clipboard.write([new ClipboardItem({"image/png":m})]),k("이미지가 클립보드에 복사됐어요! 채팅창에 붙여넣기하세요.")}catch{const g=URL.createObjectURL(m),f=document.createElement("a");f.href=g,f.download="정산결과.png",f.click(),URL.revokeObjectURL(g),navigator.clipboard.writeText(a).catch(()=>{}),k("이미지 저장됨! 채팅창에 파일로 첨부해주세요.")}}catch(r){r?.name!=="AbortError"&&(navigator.share?navigator.share({text:a}).catch(()=>{}):(navigator.clipboard.writeText(a).catch(()=>{}),k("클립보드에 복사되었습니다!")))}finally{n&&i&&(n.disabled=!1,n.innerHTML=i,lucide.createIcons({nodes:[n]}))}}function b(){const e=document.getElementById("app");e.innerHTML=`
    ${tt()}
    ${et()}
    ${at()}
    ${it()}
    ${nt()}
    ${dt()}
    ${s.result?ot():""}
    ${s.result?ct():""}
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
                 value="${h(s.meetingName)}" />
        </div>
        <div class="input-field mt-3">
          <label>날짜</label>
          <input type="date" id="meeting-date" value="${s.meetingDate}" />
        </div>
      </div>
    </section>
  `}function nt(){const e=[...new Set(s.rounds.map(a=>a.payerId).filter(Boolean))];return e.length===0?"":`
    <section class="section" style="animation-delay: 0.08s">
      <div class="section__title">
        <i data-lucide="credit-card"></i>
        <span>결제자 계좌</span>
        <span class="text-muted text-sm">(선택)</span>
      </div>
      <div class="card">
        <p class="text-muted text-sm mb-2">입력하면 정산 결과 공유 시 계좌번호가 함께 전송돼요.<br><span style="color:var(--text-tertiary)">건너뛰어도 정산 계산에는 영향 없어요.</span></p>
        ${e.map(a=>{const n=s.participants.find(i=>i.id===a);return n?`
      <div class="input-field mt-3">
        <label>💳 ${h(n.name)} 계좌</label>
        <input type="text"
               data-action="update-payer-bank" data-payer="${a}"
               value="${h(s.payerBankInfos[a]||"")}"
               placeholder="은행명 ****-**-**** ${h(n.name)}" />
      </div>
    `:""}).join("")}
      </div>
    </section>
  `}function at(){const e=s.participants.map(t=>`
    <div class="chip" data-id="${t.id}">
      <span>${h(t.name)}</span>
      <button class="chip__remove" data-action="remove-participant" data-id="${t.id}" title="삭제">×</button>
    </div>
  `).join("");return`
    <section class="section" style="animation-delay: 0.1s">
      <div class="section__title">
        <i data-lucide="users"></i>
        <span>참여자</span>
        ${s.participants.length>0?`<span class="text-muted text-sm">(${s.participants.length}명)</span>`:""}
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
        ${s.participants.length>0?`
          <div class="chip-list">${e}</div>
        `:`
          <div class="empty-state mt-3">
            <div class="empty-state__icon">👥</div>
            <p>참여자를 추가해주세요</p>
          </div>
        `}
      </div>
    </section>
  `}function it(){const e=s.rounds.map((a,n)=>st(a,n)).join("");return`
    <section class="section" style="animation-delay: 0.15s">
      <div class="section__title">
        <i data-lucide="receipt"></i>
        <span>차수별 지출</span>
      </div>
      ${s.rounds.length===0?`
    <div class="card round-empty-state">
      <div class="empty-state__icon">🧾</div>
      <p style="font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-1)">아직 추가된 차수가 없어요</p>
      <p class="text-sm text-muted">1차 식당, 2차 술집처럼<br>자리가 바뀔 때마다 차수를 추가하세요.<br>한 곳만 갔다면 1차만 추가하면 돼요.</p>
    </div>
  `:""}
      ${e}
      <button class="btn btn--secondary btn--full" id="add-round-btn"
              ${s.participants.length===0?'disabled style="opacity:0.5;cursor:not-allowed"':""}>
        <i data-lucide="plus-circle"></i>
        차수 추가
      </button>
      ${s.participants.length===0?'<p class="text-muted text-sm" style="text-align:center;margin-top:var(--space-2)">참여자를 먼저 추가해야 차수를 추가할 수 있어요</p>':""}
    </section>
  `}function st(e,t){const a=e.drinkerIds||[],n=e.beveragerIds||[],i=e.noFoodIds||[],r=s.participants.map(d=>{const m=e.participantIds.includes(d.id),l=a.includes(d.id),u=n.includes(d.id),g=l?"drinker":u?"beverage":"sober",f=l?"🍺":u?"🥤":"🚫",I=l?"음주":u?"음료":"없음";return`
      <label class="check-item ${m?"check-item--checked":""}"
             data-action="toggle-round-participant"
             data-round="${e.id}" data-participant="${d.id}">
        <input type="checkbox" ${m?"checked":""} />
        <span class="check-item__box">
          <svg viewBox="0 0 14 14"><polyline points="2 7 5.5 10.5 12 4"></polyline></svg>
        </span>
        <span>${h(d.name)}</span>
        ${e.splitDrink&&m?`
          <span class="food-toggle ${i.includes(d.id)?"food-toggle--nofood":"food-toggle--food"}"
                data-action="toggle-food"
                data-round="${e.id}" data-participant="${d.id}"
                title="클릭해서 식사 여부 변경">
            ${i.includes(d.id)?"🙅 식사X":"🍽️ 식사"}
          </span>
          <span class="drink-toggle drink-toggle--${g}"
                data-action="cycle-round-drink"
                data-round="${e.id}" data-participant="${d.id}"
                title="클릭해서 변경">
            ${f} ${I}
          </span>
        `:""}
      </label>
    `}).join(""),c=s.participants.map(d=>`<option value="${d.id}" ${e.payerId===d.id?"selected":""}>${h(d.name)}</option>`).join(""),o=e.splitDrink?`
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
    `,p=e.splitDrink?'<p class="text-muted text-sm mt-2" style="padding-left:2px"><span style="color:var(--text-tertiary);font-size:var(--font-size-xs)">🍽️/🙅 클릭: 식사 여부 · 🍺/🥤/🚫 클릭: 음주 종류 변경</span></p>':"";return`
    <div class="round-card" style="animation-delay: ${.05*t}s">
      <div class="round-card__header">
        <div class="round-card__title">
          <span class="round-card__number">${t+1}</span>
          <input type="text" value="${h(e.name)}"
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
          ${p}
        </div>

        ${rt(e)}
      </div>
    </div>
  `}function rt(e){const t=e.receiptItems||[],a=t.map(i=>{const r=(i.quantity||0)*(i.unitPrice||0);return`
      <div class="receipt-item-row">
        <input type="text" class="receipt-item__name"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${i.id}" data-field="name"
               value="${h(i.name)}" placeholder="항목명" />
        <input type="number" class="receipt-item__qty"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${i.id}" data-field="quantity"
               value="${i.quantity||""}" placeholder="수량" inputmode="numeric" />
        <input type="number" class="receipt-item__price"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${i.id}" data-field="unitPrice"
               value="${i.unitPrice||""}" placeholder="단가" inputmode="numeric" />
        <span class="receipt-item__total amount">${r>0?y(r):"-"}</span>
        <button class="receipt-item__remove" data-action="remove-receipt-item" data-round="${e.id}" data-item="${i.id}" title="삭제">×</button>
      </div>
    `}).join(""),n=t.reduce((i,r)=>i+(r.quantity||0)*(r.unitPrice||0),0);return`
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
  `}function ot(){const e=s.rounds.filter(a=>(a.receiptItems||[]).some(n=>n.name||n.unitPrice>0));return e.length===0?"":`
    <section class="section" id="receipt-summary-section" style="animation-delay: 0.05s">
      <div class="section__title">
        <i data-lucide="receipt"></i>
        <span>영수증 내역</span>
      </div>
      <div class="card receipt-summary-card">${e.map(a=>{const n=(a.receiptItems||[]).filter(c=>c.name||c.unitPrice>0),i=n.reduce((c,o)=>c+(o.quantity||0)*(o.unitPrice||0),0),r=n.map(c=>`
      <div class="receipt-summary__row">
        <span class="receipt-summary__name">${h(c.name||"(항목)")}</span>
        <span class="receipt-summary__qty">${c.quantity||0}개</span>
        <span class="receipt-summary__price amount">${y((c.quantity||0)*(c.unitPrice||0))}</span>
      </div>
    `).join("");return`
      <div class="receipt-summary__round">
        <div class="receipt-summary__round-title">${h(a.name)}</div>
        ${r}
        <div class="receipt-summary__subtotal">소계 <strong class="amount">${y(i)}</strong></div>
      </div>
    `}).join("")}</div>
    </section>
  `}function dt(){return`
    <section class="section section--cta" style="animation-delay: 0.2s">
      <button class="btn btn--primary btn--lg btn--full" id="calculate-btn"
              ${s.participants.length>0&&s.rounds.length>0?"":'disabled style="opacity:0.5;cursor:not-allowed"'}>
        <i data-lucide="calculator"></i>
        정산하기
      </button>
    </section>
  `}function ct(){const{matrix:e,totals:t,notes:a}=s.result;let n='<table class="result-table"><thead><tr>';return n+="<th>이름</th>",s.rounds.forEach(i=>{n+=`<th>${h(i.name)}</th>`}),n+='<th>총합</th><th style="text-align:left">비고</th></tr></thead><tbody>',s.participants.forEach(i=>{n+="<tr>",n+=`<td>${h(i.name)}</td>`,s.rounds.forEach(r=>{const c=e[i.id][r.id],o=r.payerId===i.id;c===null?n+='<td class="not-participated">-</td>':o?n+=`<td class="amount payer-cell">${y(c)}<span class="payer-chip">결제</span></td>`:c===0?n+='<td><span class="attend-only-badge">참석만</span></td>':n+=`<td class="amount">${y(c)}</td>`}),n+=`<td class="total-col amount">${y(t[i.id])}</td>`,n+=`<td class="note-col">${h((a[i.id]||[]).join(", "))}</td>`,n+="</tr>"}),n+="</tbody></table>",`
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
  `}function lt(){const e=document.getElementById("participant-input");e&&e.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),R())});const t=document.getElementById("add-participant-btn");t&&t.addEventListener("click",R);const a=document.getElementById("add-round-btn");a&&a.addEventListener("click",U);const n=document.getElementById("calculate-btn");n&&n.addEventListener("click",Q);const i=document.getElementById("copy-result-btn");i&&i.addEventListener("click",Y);const r=document.getElementById("share-result-btn");r&&r.addEventListener("click",Z);const c=document.getElementById("reset-btn");c&&c.addEventListener("click",()=>{confirm("모든 데이터를 초기화할까요?")&&H()});const o=document.getElementById("meeting-name");o&&o.addEventListener("input",d=>{s.meetingName=d.target.value,v()});const p=document.getElementById("meeting-date");if(p&&p.addEventListener("input",d=>{s.meetingDate=d.target.value,v()}),!P){const d=document.getElementById("app");d.addEventListener("click",ut),d.addEventListener("change",pt),d.addEventListener("input",mt),d.addEventListener("blur",m=>{m.target.closest('[data-action="update-receipt-item"]')&&b()},!0),P=!0}}function ut(e){const t=e.target.closest("[data-action]");if(!t)return;switch(t.dataset.action){case"remove-participant":M(t.dataset.id);break;case"toggle-food":e.preventDefault(),e.stopPropagation(),J(parseInt(t.dataset.round),t.dataset.participant);break;case"cycle-round-drink":e.preventDefault(),e.stopPropagation(),z(parseInt(t.dataset.round),t.dataset.participant);break;case"toggle-round-participant":e.preventDefault(),G(parseInt(t.dataset.round),t.dataset.participant);break;case"remove-round":X(parseInt(t.dataset.round));break;case"add-receipt-item":K(parseInt(t.dataset.round));break;case"remove-receipt-item":V(parseInt(t.dataset.round),t.dataset.item);break;case"copy-bank":{const n=t.dataset.bank;navigator.clipboard.writeText(n).then(()=>{k("계좌번호 복사됨!")}).catch(()=>{const i=document.createElement("textarea");i.value=n,document.body.appendChild(i),i.select(),document.execCommand("copy"),i.remove(),k("계좌번호 복사됨!")});break}}}function pt(e){const t=e.target.closest("[data-action]");if(!t)return;switch(t.dataset.action){case"toggle-split-drink":D(parseInt(t.dataset.round),"splitDrink",t.checked);break;case"update-round":t.tagName==="SELECT"&&D(parseInt(t.dataset.round),t.dataset.field,t.value);break}}function mt(e){const t=e.target.closest("[data-action]");if(t){if(t.dataset.action==="update-payer-bank"){s.payerBankInfos[t.dataset.payer]=t.value,s.result=null,v();return}if(t.dataset.action==="update-receipt-item"){W(parseInt(t.dataset.round),t.dataset.item,t.dataset.field,t.value);return}if(t.dataset.action==="update-round"){const a=s.rounds.find(i=>i.id===parseInt(t.dataset.round));if(!a)return;const n=t.dataset.field;n==="totalAmount"||n==="foodAmount"||n==="drinkAmount"||n==="beverageAmount"?a[n]=parseInt(t.value)||0:n==="name"&&(a[n]=t.value),s.result=null,v()}}}function h(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}j();b();
