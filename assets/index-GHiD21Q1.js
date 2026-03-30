(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();function S(e,t){const a={};e.forEach(d=>{a[d.id]=0});const n={};e.forEach(d=>{n[d.id]={},t.forEach(u=>{n[d.id][u.id]=null})});const s={};e.forEach(d=>{s[d.id]=[]}),t.forEach(d=>{const u=e.filter(l=>d.participantIds.includes(l.id));if(u.length===0)return;let c={};if(d.splitDrink){const l=d.foodAmount||0,p=d.drinkAmount||0,f=d.beverageAmount||0,$=d.drinkerIds||[],_=d.beveragerIds||[],E=u.length,A=u.filter(y=>$.includes(y.id)).length,w=u.filter(y=>_.includes(y.id)).length,k=E>0?l/E:0,D=A>0?p/A:0,L=w>0?f/w:0;u.forEach(y=>{$.includes(y.id)?c[y.id]=k+D:_.includes(y.id)?c[y.id]=k+L:c[y.id]=k})}else{const l=d.totalAmount||0,p=u.length>0?l/u.length:0;u.forEach(f=>{c[f.id]=p})}Object.keys(c).forEach(l=>{c[l]=x(c[l])}),u.forEach(l=>{n[l.id][d.id]=c[l.id]});const m=d.splitDrink?(d.foodAmount||0)+(d.drinkAmount||0)+(d.beverageAmount||0):d.totalAmount||0;u.forEach(l=>{l.id===d.payerId?a[l.id]+=m-c[l.id]:a[l.id]-=c[l.id]})}),e.forEach(d=>{const u=t.filter(l=>l.splitDrink&&l.participantIds.includes(d.id));if(u.length===0)return;const c=u.filter(l=>(l.beveragerIds||[]).includes(d.id)),m=u.filter(l=>!(l.drinkerIds||[]).includes(d.id)&&!(l.beveragerIds||[]).includes(d.id));if(c.length>0){const l=c.length===u.length;s[d.id].push(l?"음료":`${c.map(p=>p.name||`${p.id}차`).join("·")} 음료`)}if(m.length>0){const l=m.length===u.length;s[d.id].push(l?"비음주":`${m.map(p=>p.name||`${p.id}차`).join("·")} 비음주`)}});const r={};e.forEach(d=>{let u=0;t.forEach(c=>{const m=n[d.id][c.id];m!==null&&(u+=m)}),r[d.id]=u});const o=C(a,e);return{matrix:n,totals:r,notes:s,transfers:o}}function C(e,t){const a=[],n={};t.forEach(o=>{n[o.id]=o.name});let s=[],r=[];for(Object.keys(e).forEach(o=>{const d=x(e[o]);d>0?s.push({id:o,amount:d}):d<0&&r.push({id:o,amount:Math.abs(d)})}),s.sort((o,d)=>d.amount-o.amount),r.sort((o,d)=>d.amount-o.amount);s.length>0&&r.length>0;){const o=s[0],d=r[0],u=Math.min(o.amount,d.amount);u>0&&a.push({from:n[d.id],fromId:d.id,to:n[o.id],toId:o.id,amount:x(u)}),o.amount-=u,d.amount-=u,o.amount<=0&&s.shift(),d.amount<=0&&r.shift()}return a}function x(e){return Math.round(e/100)*100}function b(e){return e==null?"-":e.toLocaleString("ko-KR")+"원"}function R(e,t,a,n={}){const{transfers:s}=a,r=[],o=t.filter(c=>(c.receiptItems||[]).some(m=>m.name||m.unitPrice>0));o.length>0&&(r.push("🧾 영수증 내역"),o.forEach(c=>{const m=(c.receiptItems||[]).filter(p=>p.name||p.unitPrice>0);r.push(`
📍 ${c.name}`),m.forEach(p=>{const f=(p.quantity||0)*(p.unitPrice||0);r.push(`  ${p.name||"(항목)"} × ${p.quantity||0} = ${b(f)}`)});const l=m.reduce((p,f)=>p+(f.quantity||0)*(f.unitPrice||0),0);l>0&&r.push(`  소계: ${b(l)}`)}),r.push(""),r.push("─────────────────"),r.push("")),r.push("🧾 차수별 내역");let d=0;return t.forEach(c=>{const m=c.participantIds.length,l=c.splitDrink?(c.foodAmount||0)+(c.drinkAmount||0)+(c.beverageAmount||0):c.totalAmount||0;if(l===0)return;d+=l;const p=e.find($=>$.id===c.payerId),f=p?` · ${p.name} 결제`:"";r.push(`${c.name}: ${b(l)} (${m}명${f})`)}),t.length>1&&r.push(`총 합계: ${b(d)}`),r.push(""),r.push("─────────────────"),s.length===0?(r.push("✅ 모두 정산 완료!"),r.join(`
`)):(r.push("💸 송금 안내"),[...new Set(s.map(c=>c.toId))].forEach(c=>{const m=e.find(p=>p.id===c);if(!m)return;const l=n[c]||"";r.push(""),r.push(`📌 ${m.name}에게 보내주세요`),l.trim()&&r.push(`💳 ${l.trim()}`),s.filter(p=>p.toId===c).forEach(p=>{r.push(`  ${p.from} → ${b(p.amount)}`)})}),r.join(`
`))}let i={meetingName:"",meetingDate:new Date().toISOString().split("T")[0],payerBankInfos:{},participants:[],rounds:[],result:null,nextParticipantId:1,nextRoundId:1};function T(){return`p${i.nextParticipantId++}`}function N(){return i.nextRoundId++}function g(){try{localStorage.setItem("splitEasy_state",JSON.stringify(i))}catch{}}function O(){try{const e=localStorage.getItem("splitEasy_state");if(e){const t=JSON.parse(e);i={...i,...t}}}catch{}}function j(){localStorage.removeItem("splitEasy_state"),i={meetingName:"",meetingDate:new Date().toISOString().split("T")[0],payerBankInfos:{},participants:[],rounds:[],result:null,nextParticipantId:1,nextRoundId:1},h()}function I(e,t="success"){const a=document.getElementById("toast-container"),n=document.createElement("div");n.className=`toast toast--${t}`,n.innerHTML=`
    <i data-lucide="${t==="success"?"check-circle":"info"}"></i>
    <span>${e}</span>
  `,a.appendChild(n),lucide.createIcons({nodes:[n]}),setTimeout(()=>{n.style.animation="toastOut 300ms ease-out forwards",setTimeout(()=>n.remove(),300)},2e3)}function B(){const t=document.getElementById("participant-input").value.trim();if(t){if(i.participants.some(a=>a.name===t)){I("이미 추가된 이름입니다","info");return}i.participants.push({id:T(),name:t}),i.result=null,g(),h(),document.getElementById("participant-input").focus()}}function q(e){i.participants=i.participants.filter(t=>t.id!==e),i.rounds.forEach(t=>{t.participantIds=t.participantIds.filter(a=>a!==e),t.drinkerIds=(t.drinkerIds||[]).filter(a=>a!==e),t.beveragerIds=(t.beveragerIds||[]).filter(a=>a!==e),t.payerId===e&&(t.payerId=null)}),i.result=null,g(),h()}function H(e,t){const a=i.rounds.find(r=>r.id===e);if(!a)return;a.drinkerIds||(a.drinkerIds=[]),a.beveragerIds||(a.beveragerIds=[]);const n=a.drinkerIds.includes(t),s=a.beveragerIds.includes(t);n?(a.drinkerIds=a.drinkerIds.filter(r=>r!==t),a.beveragerIds.push(t)):s?a.beveragerIds=a.beveragerIds.filter(r=>r!==t):a.drinkerIds.push(t),i.result=null,g(),h()}function M(){const e=N(),t=i.rounds.length+1,a=i.rounds[i.rounds.length-1],n=a?[...a.participantIds]:i.participants.map(s=>s.id);i.rounds.push({id:e,name:`${t}차`,totalAmount:0,foodAmount:0,drinkAmount:0,beverageAmount:0,splitDrink:!1,payerId:i.participants.length>0?i.participants[0].id:null,participantIds:n,drinkerIds:[...n],beveragerIds:[],receiptItems:[],nextReceiptItemId:1}),i.result=null,g(),h(),setTimeout(()=>{const s=document.querySelectorAll(".round-card"),r=s[s.length-1];r&&r.scrollIntoView({behavior:"smooth",block:"center"})},100)}function z(e){const t=i.rounds.find(a=>a.id===e);t&&(t.receiptItems||(t.receiptItems=[]),t.nextReceiptItemId||(t.nextReceiptItemId=1),t.receiptItems.push({id:t.nextReceiptItemId++,name:"",quantity:1,unitPrice:0}),g(),h())}function U(e,t){const a=i.rounds.find(n=>n.id===e);a&&(a.receiptItems=(a.receiptItems||[]).filter(n=>n.id!==parseInt(t)),g(),h())}function F(e,t,a,n){const s=i.rounds.find(o=>o.id===e);if(!s)return;const r=(s.receiptItems||[]).find(o=>o.id===parseInt(t));r&&(a==="quantity"||a==="unitPrice"?r[a]=parseInt(n)||0:r[a]=n,g())}function J(e){i.rounds=i.rounds.filter(t=>t.id!==e),i.result=null,g(),h()}function P(e,t,a){const n=i.rounds.find(s=>s.id===e);n&&(t==="totalAmount"||t==="foodAmount"||t==="drinkAmount"||t==="beverageAmount"?n[t]=parseInt(a)||0:t==="splitDrink"?(n[t]=a,a&&n.totalAmount>0&&n.foodAmount===0?(n.foodAmount=n.totalAmount,n.totalAmount=0):!a&&n.foodAmount>0&&(n.totalAmount=n.foodAmount+n.drinkAmount,n.foodAmount=0,n.drinkAmount=0)):n[t]=a,i.result=null,g(),h())}function K(e,t){const a=i.rounds.find(s=>s.id===e);if(!a)return;const n=a.participantIds.indexOf(t);n>=0?a.participantIds.splice(n,1):a.participantIds.push(t),i.result=null,g(),h()}function V(){if(i.participants.length===0){I("참여자를 추가해주세요","info");return}if(i.rounds.length===0){I("차수를 추가해주세요","info");return}i.result=S(i.participants,i.rounds),g(),h(),setTimeout(()=>{const e=document.getElementById("result-section");e&&e.scrollIntoView({behavior:"smooth",block:"start"})},100)}function W(){if(!i.result)return;const e=R(i.participants,i.rounds,i.result,i.payerBankInfos),t=i.meetingName?`📋 [${i.meetingName}] 정산 결과  ${i.meetingDate}

`:"";navigator.clipboard.writeText(t+e).then(()=>{I("클립보드에 복사되었습니다!")}).catch(()=>{const a=document.createElement("textarea");a.value=t+e,document.body.appendChild(a),a.select(),document.execCommand("copy"),a.remove(),I("클립보드에 복사되었습니다!")})}async function G(){if(!i.result)return;const e=R(i.participants,i.rounds,i.result,i.payerBankInfos),a=(i.meetingName?`📋 [${i.meetingName}] 정산 결과  ${i.meetingDate}

`:`📋 정산 결과  ${i.meetingDate}

`)+e,n=document.getElementById("share-result-btn"),s=n?.innerHTML;n&&(n.disabled=!0,n.innerHTML='<i data-lucide="loader-circle" style="width:16px;height:16px;animation:spin 1s linear infinite"></i> 준비 중...',lucide.createIcons({nodes:[n]}));try{const r=document.getElementById("receipt-summary-section"),o=document.getElementById("result-section");await document.fonts.ready;const d=document.createElement("div");if(d.style.cssText="position:fixed;top:-9999px;left:-9999px;padding:24px;background:#0d1117;min-width:360px;",r){const p=r.cloneNode(!0);p.style.animation="none",d.appendChild(p)}const u=o.cloneNode(!0);u.style.animation="none",d.appendChild(u),document.body.appendChild(d);const c=await html2canvas(d,{backgroundColor:"#0d1117",scale:2,useCORS:!0,logging:!1});document.body.removeChild(d);const m=await new Promise(p=>c.toBlob(p,"image/png")),l=new File([m],"정산결과.png",{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[l]}))await navigator.share({files:[l],text:a});else if(navigator.share)await navigator.share({text:a});else{const p=URL.createObjectURL(m),f=document.createElement("a");f.href=p,f.download="정산결과.png",f.click(),URL.revokeObjectURL(p),navigator.clipboard.writeText(a).catch(()=>{}),I("이미지 저장 + 텍스트 복사 완료!")}}catch(r){r?.name!=="AbortError"&&(navigator.share?navigator.share({text:a}).catch(()=>{}):(navigator.clipboard.writeText(a).catch(()=>{}),I("클립보드에 복사되었습니다!")))}finally{n&&s&&(n.disabled=!1,n.innerHTML=s,lucide.createIcons({nodes:[n]}))}}function h(){const e=document.getElementById("app");e.innerHTML=`
    ${Q()}
    ${X()}
    ${Z()}
    ${tt()}
    ${Y()}
    ${it()}
    ${i.result?at():""}
    ${i.result?st():""}
  `,rt(),lucide.createIcons()}function Q(){return`
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
  `}function X(){return`
    <section class="section" style="animation-delay: 0.05s">
      <div class="section__title">
        <i data-lucide="calendar"></i>
        <span>모임 정보</span>
      </div>
      <div class="card">
        <div class="input-field">
          <label>모임 이름</label>
          <input type="text" id="meeting-name" placeholder="예: 팀 회식"
                 value="${v(i.meetingName)}" />
        </div>
        <div class="input-field mt-3">
          <label>날짜</label>
          <input type="date" id="meeting-date" value="${i.meetingDate}" />
        </div>
      </div>
    </section>
  `}function Y(){const e=[...new Set(i.rounds.map(a=>a.payerId).filter(Boolean))];return e.length===0?"":`
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
        <label>💳 ${v(n.name)} 계좌</label>
        <input type="text"
               data-action="update-payer-bank" data-payer="${a}"
               value="${v(i.payerBankInfos[a]||"")}"
               placeholder="은행명 ****-**-**** ${v(n.name)}" />
      </div>
    `:""}).join("")}
      </div>
    </section>
  `}function Z(){const e=i.participants.map(t=>`
    <div class="chip" data-id="${t.id}">
      <span>${v(t.name)}</span>
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
  `}function tt(){const e=i.rounds.map((a,n)=>et(a,n)).join("");return`
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
  `}function et(e,t){const a=e.drinkerIds||[],n=e.beveragerIds||[],s=i.participants.map(u=>{const c=e.participantIds.includes(u.id),m=a.includes(u.id),l=n.includes(u.id),p=m?"drinker":l?"beverage":"sober",f=m?"🍺":l?"🥤":"🚫",$=m?"음주":l?"음료":"없음";return`
      <label class="check-item ${c?"check-item--checked":""}"
             data-action="toggle-round-participant"
             data-round="${e.id}" data-participant="${u.id}">
        <input type="checkbox" ${c?"checked":""} />
        <span class="check-item__box">
          <svg viewBox="0 0 14 14"><polyline points="2 7 5.5 10.5 12 4"></polyline></svg>
        </span>
        <span>${v(u.name)}</span>
        ${e.splitDrink&&c?`
          <span class="drink-toggle drink-toggle--${p}"
                data-action="cycle-round-drink"
                data-round="${e.id}" data-participant="${u.id}"
                title="클릭해서 변경">
            ${f} ${$}
          </span>
        `:""}
      </label>
    `}).join(""),r=i.participants.map(u=>`<option value="${u.id}" ${e.payerId===u.id?"selected":""}>${v(u.name)}</option>`).join(""),o=e.splitDrink?`
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
    `,d=e.splitDrink?'<p class="text-muted text-sm mt-2" style="padding-left:2px"><span style="color:var(--text-tertiary);font-size:var(--font-size-xs)">아이콘을 클릭할 때마다 순환돼요: 🍺 음주 → 🥤 음료 → 🚫 없음(음식만)</span></p>':"";return`
    <div class="round-card" style="animation-delay: ${.05*t}s">
      <div class="round-card__header">
        <div class="round-card__title">
          <span class="round-card__number">${t+1}</span>
          <input type="text" value="${v(e.name)}"
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
              ${r}
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
            ${s}
          </div>
          ${d}
        </div>

        ${nt(e)}
      </div>
    </div>
  `}function nt(e){const t=e.receiptItems||[],a=t.map(s=>{const r=(s.quantity||0)*(s.unitPrice||0);return`
      <div class="receipt-item-row">
        <input type="text" class="receipt-item__name"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${s.id}" data-field="name"
               value="${v(s.name)}" placeholder="항목명" />
        <input type="number" class="receipt-item__qty"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${s.id}" data-field="quantity"
               value="${s.quantity||""}" placeholder="수량" inputmode="numeric" />
        <input type="number" class="receipt-item__price"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${s.id}" data-field="unitPrice"
               value="${s.unitPrice||""}" placeholder="단가" inputmode="numeric" />
        <span class="receipt-item__total amount">${r>0?b(r):"-"}</span>
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
          <div class="receipt-items-subtotal">소계 <strong class="amount">${b(n)}</strong></div>
        `}
    </div>
  `}function at(){const e=i.rounds.filter(a=>(a.receiptItems||[]).some(n=>n.name||n.unitPrice>0));return e.length===0?"":`
    <section class="section" id="receipt-summary-section" style="animation-delay: 0.05s">
      <div class="section__title">
        <i data-lucide="receipt"></i>
        <span>영수증 내역</span>
      </div>
      <div class="card receipt-summary-card">${e.map(a=>{const n=(a.receiptItems||[]).filter(o=>o.name||o.unitPrice>0),s=n.reduce((o,d)=>o+(d.quantity||0)*(d.unitPrice||0),0),r=n.map(o=>`
      <div class="receipt-summary__row">
        <span class="receipt-summary__name">${v(o.name||"(항목)")}</span>
        <span class="receipt-summary__qty">${o.quantity||0}개</span>
        <span class="receipt-summary__price amount">${b((o.quantity||0)*(o.unitPrice||0))}</span>
      </div>
    `).join("");return`
      <div class="receipt-summary__round">
        <div class="receipt-summary__round-title">${v(a.name)}</div>
        ${r}
        <div class="receipt-summary__subtotal">소계 <strong class="amount">${b(s)}</strong></div>
      </div>
    `}).join("")}</div>
    </section>
  `}function it(){return`
    <section class="section section--cta" style="animation-delay: 0.2s">
      <button class="btn btn--primary btn--lg btn--full" id="calculate-btn"
              ${i.participants.length>0&&i.rounds.length>0?"":'disabled style="opacity:0.5;cursor:not-allowed"'}>
        <i data-lucide="calculator"></i>
        정산하기
      </button>
    </section>
  `}function st(){const{matrix:e,totals:t,notes:a}=i.result;let n='<table class="result-table"><thead><tr>';return n+="<th>이름</th>",i.rounds.forEach(s=>{n+=`<th>${v(s.name)}</th>`}),n+='<th>총합</th><th style="text-align:left">비고</th></tr></thead><tbody>',i.participants.forEach(s=>{n+="<tr>",n+=`<td>${v(s.name)}</td>`,i.rounds.forEach(r=>{const o=e[s.id][r.id],d=r.payerId===s.id;o===null?n+='<td class="not-participated">-</td>':d?n+=`<td class="amount payer-cell">${b(o)}<span class="payer-chip">결제</span></td>`:o===0?n+='<td style="color:var(--success)">0원</td>':n+=`<td class="amount">${b(o)}</td>`}),n+=`<td class="total-col amount">${b(t[s.id])}</td>`,n+=`<td class="note-col">${v((a[s.id]||[]).join(", "))}</td>`,n+="</tr>"}),n+="</tbody></table>",`
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
  `}function rt(){const e=document.getElementById("participant-input");e&&e.addEventListener("keydown",c=>{c.key==="Enter"&&(c.preventDefault(),B())});const t=document.getElementById("add-participant-btn");t&&t.addEventListener("click",B);const a=document.getElementById("add-round-btn");a&&a.addEventListener("click",M);const n=document.getElementById("calculate-btn");n&&n.addEventListener("click",V);const s=document.getElementById("copy-result-btn");s&&s.addEventListener("click",W);const r=document.getElementById("share-result-btn");r&&r.addEventListener("click",G);const o=document.getElementById("reset-btn");o&&o.addEventListener("click",()=>{confirm("모든 데이터를 초기화할까요?")&&j()});const d=document.getElementById("meeting-name");d&&d.addEventListener("input",c=>{i.meetingName=c.target.value,g()});const u=document.getElementById("meeting-date");u&&u.addEventListener("input",c=>{i.meetingDate=c.target.value,g()}),document.getElementById("app").addEventListener("click",dt),document.getElementById("app").addEventListener("change",ot),document.getElementById("app").addEventListener("input",ct),document.getElementById("app").addEventListener("blur",c=>{c.target.closest('[data-action="update-receipt-item"]')&&h()},!0)}function dt(e){const t=e.target.closest("[data-action]");if(!t)return;switch(t.dataset.action){case"remove-participant":q(t.dataset.id);break;case"cycle-round-drink":e.preventDefault(),e.stopPropagation(),H(parseInt(t.dataset.round),t.dataset.participant);break;case"toggle-round-participant":e.preventDefault(),K(parseInt(t.dataset.round),t.dataset.participant);break;case"remove-round":J(parseInt(t.dataset.round));break;case"add-receipt-item":z(parseInt(t.dataset.round));break;case"remove-receipt-item":U(parseInt(t.dataset.round),t.dataset.item);break;case"copy-bank":{const n=t.dataset.bank;navigator.clipboard.writeText(n).then(()=>{I("계좌번호 복사됨!")}).catch(()=>{const s=document.createElement("textarea");s.value=n,document.body.appendChild(s),s.select(),document.execCommand("copy"),s.remove(),I("계좌번호 복사됨!")});break}}}function ot(e){const t=e.target.closest("[data-action]");if(!t)return;switch(t.dataset.action){case"toggle-split-drink":P(parseInt(t.dataset.round),"splitDrink",t.checked);break;case"update-round":t.tagName==="SELECT"&&P(parseInt(t.dataset.round),t.dataset.field,t.value);break}}function ct(e){const t=e.target.closest("[data-action]");if(t){if(t.dataset.action==="update-payer-bank"){i.payerBankInfos[t.dataset.payer]=t.value,i.result=null,g();return}if(t.dataset.action==="update-receipt-item"){F(parseInt(t.dataset.round),t.dataset.item,t.dataset.field,t.value);return}if(t.dataset.action==="update-round"){const a=i.rounds.find(s=>s.id===parseInt(t.dataset.round));if(!a)return;const n=t.dataset.field;n==="totalAmount"||n==="foodAmount"||n==="drinkAmount"||n==="beverageAmount"?a[n]=parseInt(t.value)||0:n==="name"&&(a[n]=t.value),i.result=null,g()}}}function v(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}O();h();
