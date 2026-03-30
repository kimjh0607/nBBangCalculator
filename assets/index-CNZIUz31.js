(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();function O(e,t){const n={};e.forEach(o=>{n[o.id]=0});const a={};e.forEach(o=>{a[o.id]={},t.forEach(l=>{a[o.id][l.id]=null})});const i={};e.forEach(o=>{i[o.id]=[]}),t.forEach(o=>{const l=e.filter(u=>o.participantIds.includes(u.id));if(l.length===0)return;let c={};if(o.splitDrink){const u=o.foodAmount||0,f=o.drinkAmount||0,g=o.beverageAmount||0,m=o.drinkerIds||[],I=o.beveragerIds||[],_=o.noFoodIds||[],x=l.filter(k=>!_.includes(k.id)).length,A=l.filter(k=>m.includes(k.id)).length,R=l.filter(k=>I.includes(k.id)).length,C=x>0?u/x:0,L=A>0?f/A:0,T=R>0?g/R:0;l.forEach(k=>{let E=0;_.includes(k.id)||(E+=C),m.includes(k.id)?E+=L:I.includes(k.id)&&(E+=T),c[k.id]=E})}else{const u=o.totalAmount||0,f=l.length>0?u/l.length:0;l.forEach(g=>{c[g.id]=f})}Object.keys(c).forEach(u=>{c[u]=B(c[u])}),l.forEach(u=>{a[u.id][o.id]=c[u.id]});const p=o.splitDrink?(o.foodAmount||0)+(o.drinkAmount||0)+(o.beverageAmount||0):o.totalAmount||0;l.forEach(u=>{u.id===o.payerId?n[u.id]+=p-c[u.id]:n[u.id]-=c[u.id]})}),e.forEach(o=>{const l=t.filter(m=>m.splitDrink&&m.participantIds.includes(o.id));if(l.length===0)return;const c=[],p=[],u=[],f=[];l.forEach(m=>{const I=(m.drinkerIds||[]).includes(o.id),_=(m.beveragerIds||[]).includes(o.id),x=(m.noFoodIds||[]).includes(o.id);x&&!I&&!_?c.push(m):_?p.push(m):!I&&!_?u.push(m):I&&x&&f.push(m)});const g=(m,I,_)=>_?I:`${m.map(x=>x.name||`${x.id}차`).join("·")} ${I}`;c.length>0&&i[o.id].push(g(c,"참석만",c.length===l.length)),p.length>0&&i[o.id].push(g(p,"음료",p.length===l.length)),u.length>0&&i[o.id].push(g(u,"비음주",u.length===l.length)),f.length>0&&i[o.id].push(g(f,"음식X",f.length===l.length))});const r={};e.forEach(o=>{let l=0;t.forEach(c=>{const p=a[o.id][c.id];p!==null&&(l+=p)}),r[o.id]=l});const d=j(n,e);return{matrix:a,totals:r,notes:i,transfers:d}}function j(e,t){const n=[],a={};t.forEach(d=>{a[d.id]=d.name});let i=[],r=[];for(Object.keys(e).forEach(d=>{const o=B(e[d]);o>0?i.push({id:d,amount:o}):o<0&&r.push({id:d,amount:Math.abs(o)})}),i.sort((d,o)=>o.amount-d.amount),r.sort((d,o)=>o.amount-d.amount);i.length>0&&r.length>0;){const d=i[0],o=r[0],l=Math.min(d.amount,o.amount);l>0&&n.push({from:a[o.id],fromId:o.id,to:a[d.id],toId:d.id,amount:B(l)}),d.amount-=l,o.amount-=l,d.amount<=0&&i.shift(),o.amount<=0&&r.shift()}return n}function B(e){return Math.round(e/100)*100}function $(e){return e==null?"-":e.toLocaleString("ko-KR")+"원"}const F={"004":"국민","088":"신한","020":"우리","081":"하나","011":"농협","003":"기업","023":"SC제일","032":"부산","034":"광주","031":"대구","037":"전북","035":"제주","007":"수협","002":"산업","045":"새마을금고","048":"신협","089":"케이뱅크","090":"카카오뱅크","092":"토스뱅크"};function S(e,t,n,a={}){const{transfers:i}=n,r=[];return i.length===0?(r.push("✅ 모두 정산 완료!"),r.join(`
`)):(r.push("💸 송금 안내"),[...new Set(i.map(o=>o.toId))].forEach(o=>{const l=e.find(f=>f.id===o);if(!l)return;const c=a[o]||{},p=F[c.bankCode]||"",u=p&&c.accountNumber;r.push(""),r.push(`📌 ${l.name}에게 보내주세요`),u&&r.push(`💳 ${p} ${c.accountNumber}`),i.filter(f=>f.toId===o).forEach(f=>{r.push(`  ${f.from} → ${$(f.amount)}`)})}),r.join(`
`))}const w=[{code:"090",name:"카카오뱅크"},{code:"092",name:"토스뱅크"},{code:"089",name:"케이뱅크"},{code:"004",name:"국민"},{code:"088",name:"신한"},{code:"020",name:"우리"},{code:"081",name:"하나"},{code:"011",name:"농협"},{code:"003",name:"기업"},{code:"023",name:"SC제일"},{code:"032",name:"부산"},{code:"034",name:"광주"},{code:"031",name:"대구"},{code:"037",name:"전북"},{code:"035",name:"제주"},{code:"007",name:"수협"},{code:"002",name:"산업"},{code:"045",name:"새마을금고"},{code:"048",name:"신협"}];let s={meetingName:"",meetingDate:new Date().toISOString().split("T")[0],payerBankInfos:{},participants:[],rounds:[],result:null,nextParticipantId:1,nextRoundId:1},N=!1;function q(){return`p${s.nextParticipantId++}`}function H(){return s.nextRoundId++}function b(){try{localStorage.setItem("splitEasy_state",JSON.stringify(s))}catch{}}function M(){try{const e=localStorage.getItem("splitEasy_state");if(e){const t=JSON.parse(e);s={...s,...t},s.payerBankInfos&&Object.keys(s.payerBankInfos).forEach(n=>{typeof s.payerBankInfos[n]=="string"&&(s.payerBankInfos[n]={bankCode:"",accountNumber:s.payerBankInfos[n]})})}}catch{}}function z(){localStorage.removeItem("splitEasy_state"),s={meetingName:"",meetingDate:new Date().toISOString().split("T")[0],payerBankInfos:{},participants:[],rounds:[],result:null,nextParticipantId:1,nextRoundId:1},y()}function h(e,t="success"){const n=document.getElementById("toast-container"),a=document.createElement("div");a.className=`toast toast--${t}`,a.innerHTML=`
    <i data-lucide="${t==="success"?"check-circle":"info"}"></i>
    <span>${e}</span>
  `,n.appendChild(a),lucide.createIcons({nodes:[a]}),setTimeout(()=>{a.style.animation="toastOut 300ms ease-out forwards",setTimeout(()=>a.remove(),300)},2e3)}function D(){const t=document.getElementById("participant-input").value.trim();if(t){if(s.participants.some(n=>n.name===t)){h("이미 추가된 이름입니다","info");return}s.participants.push({id:q(),name:t}),s.result=null,b(),y(),document.getElementById("participant-input").focus()}}function K(e){s.participants=s.participants.filter(t=>t.id!==e),s.rounds.forEach(t=>{t.participantIds=t.participantIds.filter(n=>n!==e),t.drinkerIds=(t.drinkerIds||[]).filter(n=>n!==e),t.beveragerIds=(t.beveragerIds||[]).filter(n=>n!==e),t.noFoodIds=(t.noFoodIds||[]).filter(n=>n!==e),t.payerId===e&&(t.payerId=null)}),s.result=null,b(),y()}function U(e,t){const n=s.rounds.find(r=>r.id===e);if(!n)return;n.drinkerIds||(n.drinkerIds=[]),n.beveragerIds||(n.beveragerIds=[]);const a=n.drinkerIds.includes(t),i=n.beveragerIds.includes(t);a?(n.drinkerIds=n.drinkerIds.filter(r=>r!==t),n.beveragerIds.push(t)):i?n.beveragerIds=n.beveragerIds.filter(r=>r!==t):n.drinkerIds.push(t),s.result=null,b(),y()}function X(){const e=H(),t=s.rounds.length+1,n=s.rounds[s.rounds.length-1],a=n?[...n.participantIds]:s.participants.map(i=>i.id);s.rounds.push({id:e,name:`${t}차`,totalAmount:0,foodAmount:0,drinkAmount:0,beverageAmount:0,splitDrink:!1,payerId:s.participants.length>0?s.participants[0].id:null,participantIds:a,drinkerIds:[...a],beveragerIds:[],receiptItems:[],nextReceiptItemId:1,noFoodIds:[]}),s.result=null,b(),y(),setTimeout(()=>{const i=document.querySelectorAll(".round-card"),r=i[i.length-1];r&&r.scrollIntoView({behavior:"smooth",block:"center"})},100)}function J(e,t){const n=s.rounds.find(i=>i.id===e);if(!n)return;n.noFoodIds||(n.noFoodIds=[]);const a=n.noFoodIds.indexOf(t);a>=0?n.noFoodIds.splice(a,1):n.noFoodIds.push(t),s.result=null,b(),y()}function V(e){const t=s.rounds.find(n=>n.id===e);t&&(t.receiptItems||(t.receiptItems=[]),t.nextReceiptItemId||(t.nextReceiptItemId=1),t.receiptItems.push({id:t.nextReceiptItemId++,name:"",quantity:1,unitPrice:0}),b(),y())}function W(e,t){const n=s.rounds.find(a=>a.id===e);n&&(n.receiptItems=(n.receiptItems||[]).filter(a=>a.id!==parseInt(t)),b(),y())}function G(e,t,n,a){const i=s.rounds.find(d=>d.id===e);if(!i)return;const r=(i.receiptItems||[]).find(d=>d.id===parseInt(t));r&&(n==="quantity"||n==="unitPrice"?r[n]=parseInt(a)||0:r[n]=a,b())}function Q(e){s.rounds=s.rounds.filter(t=>t.id!==e),s.result=null,b(),y()}function P(e,t,n){const a=s.rounds.find(i=>i.id===e);a&&(t==="totalAmount"||t==="foodAmount"||t==="drinkAmount"||t==="beverageAmount"?a[t]=parseInt(n)||0:t==="splitDrink"?(a[t]=n,n&&a.totalAmount>0&&a.foodAmount===0?(a.foodAmount=a.totalAmount,a.totalAmount=0):!n&&a.foodAmount>0&&(a.totalAmount=a.foodAmount+a.drinkAmount,a.foodAmount=0,a.drinkAmount=0)):a[t]=n,s.result=null,b(),y())}function Y(e,t){const n=s.rounds.find(i=>i.id===e);if(!n)return;const a=n.participantIds.indexOf(t);a>=0?n.participantIds.splice(a,1):n.participantIds.push(t),s.result=null,b(),y()}function Z(){if(s.participants.length===0){h("참여자를 추가해주세요","info");return}if(s.rounds.length===0){h("차수를 추가해주세요","info");return}s.result=O(s.participants,s.rounds),b(),y(),setTimeout(()=>{const e=document.getElementById("result-section");e&&e.scrollIntoView({behavior:"smooth",block:"start"})},100)}function tt(){if(!s.result)return;const e=S(s.participants,s.rounds,s.result,s.payerBankInfos),t=s.meetingName?`📋 [${s.meetingName}] 정산 결과  ${s.meetingDate}

`:"";navigator.clipboard.writeText(t+e).then(()=>{h("클립보드에 복사되었습니다!")}).catch(()=>{const n=document.createElement("textarea");n.value=t+e,document.body.appendChild(n),n.select(),document.execCommand("copy"),n.remove(),h("클립보드에 복사되었습니다!")})}async function et(){if(!s.result)return;const e=S(s.participants,s.rounds,s.result,s.payerBankInfos),n=(s.meetingName?`📋 [${s.meetingName}] 정산 결과  ${s.meetingDate}

`:`📋 정산 결과  ${s.meetingDate}

`)+e;if(!navigator.share){h("⚠️ 이 브라우저는 공유 기능 미지원 → 기본 브라우저로 열어주세요"),navigator.clipboard?.writeText(n).catch(()=>{});return}if(navigator.share){try{await navigator.share({title:s.meetingName||"정산 결과",text:n})}catch(d){if(d?.name==="AbortError")return;h(`공유 실패 (${d?.name||"알 수 없음"}): 클립보드로 복사합니다`),navigator.clipboard.writeText(n).catch(()=>{})}return}const a=document.getElementById("share-result-btn"),i=a?.innerHTML;a&&(a.disabled=!0,a.innerHTML='<i data-lucide="loader-circle" style="width:16px;height:16px;animation:spin 1s linear infinite"></i> 준비 중...',lucide.createIcons({nodes:[a]}));let r=null;if(typeof html2canvas<"u"){const d=document.createElement("div");d.style.cssText="position:fixed;top:-9999px;left:-9999px;padding:24px;background:#0d1117;min-width:360px;";try{const o=document.getElementById("receipt-summary-section"),l=document.getElementById("result-section");if(await document.fonts.ready,o){const g=o.cloneNode(!0);g.style.animation="none",d.appendChild(g)}const c=l.cloneNode(!0);c.style.animation="none";const p=c.querySelector("#transfer-section");p&&(p.style.display="none");const u=c.querySelector('.mt-4[style*="display:flex"]');u&&(u.style.display="none"),d.appendChild(c),document.body.appendChild(d);const f=await html2canvas(d,{backgroundColor:"#0d1117",scale:2,useCORS:!0,logging:!1});r=await new Promise(g=>f.toBlob(g,"image/png"))}catch{}finally{d.parentNode&&document.body.removeChild(d)}}try{if(r)try{await navigator.clipboard.write([new ClipboardItem({"image/png":r})]),h("이미지가 클립보드에 복사됐어요! 채팅창에 붙여넣기하세요.")}catch{const o=URL.createObjectURL(r),l=document.createElement("a");l.href=o,l.download="정산결과.png",l.click(),URL.revokeObjectURL(o),h("이미지 저장됨! 채팅창에 파일로 첨부해주세요.")}else await navigator.clipboard.writeText(n),h("클립보드에 복사되었습니다!")}catch{navigator.clipboard.writeText(n).catch(()=>{}),h("클립보드에 복사되었습니다!")}finally{a&&i&&(a.disabled=!1,a.innerHTML=i,lucide.createIcons({nodes:[a]}))}}function y(){const e=document.getElementById("app");e.innerHTML=`
    ${nt()}
    ${at()}
    ${it()}
    ${ot()}
    ${st()}
    ${lt()}
    ${s.result?ct():""}
    ${s.result?ut():""}
  `,pt(),lucide.createIcons({nodes:[e]})}function nt(){return`
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
  `}function at(){return`
    <section class="section" style="animation-delay: 0.05s">
      <div class="section__title">
        <i data-lucide="calendar"></i>
        <span>모임 정보</span>
      </div>
      <div class="card">
        <div class="input-field">
          <label>모임 이름</label>
          <input type="text" id="meeting-name" placeholder="예: 팀 회식"
                 value="${v(s.meetingName)}" />
        </div>
        <div class="input-field mt-3">
          <label>날짜</label>
          <input type="date" id="meeting-date" value="${s.meetingDate}" />
        </div>
      </div>
    </section>
  `}function st(){const e=[...new Set(s.rounds.map(n=>n.payerId).filter(Boolean))];return e.length===0?"":(w.map(n=>`<option value="${n.code}">${n.name}</option>`).join(""),`
    <section class="section" style="animation-delay: 0.08s">
      <div class="section__title">
        <i data-lucide="credit-card"></i>
        <span>결제자 계좌</span>
        <span class="text-muted text-sm">(선택)</span>
      </div>
      <div class="card">
        <p class="text-muted text-sm mb-2">입력하면 공유 시 토스 송금 링크가 함께 전송돼요.<br><span style="color:var(--text-tertiary)">건너뛰어도 정산 계산에는 영향 없어요.</span></p>
        ${e.map(n=>{const a=s.participants.find(o=>o.id===n);if(!a)return"";const i=s.payerBankInfos[n]||{},r=i.bankCode||"",d=i.accountNumber||"";return`
      <div class="input-field mt-3">
        <label>💳 ${v(a.name)} 계좌</label>
        <div class="bank-input-row">
          <select data-action="update-payer-bank-code" data-payer="${n}" class="bank-select">
            <option value="" ${r?"":"selected"}>은행 선택</option>
            ${w.map(o=>`<option value="${o.code}" ${r===o.code?"selected":""}>${o.name}</option>`).join("")}
          </select>
          <input type="text" inputmode="numeric"
                 data-action="update-payer-bank-account" data-payer="${n}"
                 value="${v(d)}"
                 placeholder="계좌번호 (숫자만)" class="bank-account-input" />
        </div>
      </div>
    `}).join("")}
      </div>
    </section>
  `)}function it(){const e=s.participants.map(t=>`
    <div class="chip" data-id="${t.id}">
      <span>${v(t.name)}</span>
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
  `}function ot(){const e=s.rounds.map((n,a)=>rt(n,a)).join("");return`
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
  `}function rt(e,t){const n=e.drinkerIds||[],a=e.beveragerIds||[],i=e.noFoodIds||[],r=s.participants.map(c=>{const p=e.participantIds.includes(c.id),u=n.includes(c.id),f=a.includes(c.id),g=u?"drinker":f?"beverage":"sober",m=u?"🍺":f?"🥤":"🚫",I=u?"음주":f?"음료":"없음";return`
      <label class="check-item ${p?"check-item--checked":""}"
             data-action="toggle-round-participant"
             data-round="${e.id}" data-participant="${c.id}">
        <input type="checkbox" ${p?"checked":""} />
        <span class="check-item__box">
          <svg viewBox="0 0 14 14"><polyline points="2 7 5.5 10.5 12 4"></polyline></svg>
        </span>
        <span>${v(c.name)}</span>
        ${e.splitDrink&&p?`
          <span class="food-toggle ${i.includes(c.id)?"food-toggle--nofood":"food-toggle--food"}"
                data-action="toggle-food"
                data-round="${e.id}" data-participant="${c.id}"
                title="클릭해서 식사 여부 변경">
            ${i.includes(c.id)?"🙅 식사X":"🍽️ 식사"}
          </span>
          <span class="drink-toggle drink-toggle--${g}"
                data-action="cycle-round-drink"
                data-round="${e.id}" data-participant="${c.id}"
                title="클릭해서 변경">
            ${m} ${I}
          </span>
        `:""}
      </label>
    `}).join(""),d=s.participants.map(c=>`<option value="${c.id}" ${e.payerId===c.id?"selected":""}>${v(c.name)}</option>`).join(""),o=e.splitDrink?`
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
    `,l=e.splitDrink?'<p class="text-muted text-sm mt-2" style="padding-left:2px"><span style="color:var(--text-tertiary);font-size:var(--font-size-xs)">🍽️/🙅 클릭: 식사 여부 · 🍺/🥤/🚫 클릭: 음주 종류 변경</span></p>':"";return`
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
              ${d}
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
          ${l}
        </div>

        ${dt(e)}
      </div>
    </div>
  `}function dt(e){const t=e.receiptItems||[],n=t.map(i=>{const r=(i.quantity||0)*(i.unitPrice||0);return`
      <div class="receipt-item-row">
        <input type="text" class="receipt-item__name"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${i.id}" data-field="name"
               value="${v(i.name)}" placeholder="항목명" />
        <input type="number" class="receipt-item__qty"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${i.id}" data-field="quantity"
               value="${i.quantity||""}" placeholder="수량" inputmode="numeric" />
        <input type="number" class="receipt-item__price"
               data-action="update-receipt-item" data-round="${e.id}" data-item="${i.id}" data-field="unitPrice"
               value="${i.unitPrice||""}" placeholder="단가" inputmode="numeric" />
        <span class="receipt-item__total amount">${r>0?$(r):"-"}</span>
        <button class="receipt-item__remove" data-action="remove-receipt-item" data-round="${e.id}" data-item="${i.id}" title="삭제">×</button>
      </div>
    `}).join(""),a=t.reduce((i,r)=>i+(r.quantity||0)*(r.unitPrice||0),0);return`
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
          <div class="receipt-items-list">${n}</div>
          <div class="receipt-items-subtotal">소계 <strong class="amount">${$(a)}</strong></div>
        `}
    </div>
  `}function ct(){const e=s.rounds.filter(n=>(n.receiptItems||[]).some(a=>a.name||a.unitPrice>0));return e.length===0?"":`
    <section class="section" id="receipt-summary-section" style="animation-delay: 0.05s">
      <div class="section__title">
        <i data-lucide="receipt"></i>
        <span>영수증 내역</span>
      </div>
      <div class="card receipt-summary-card">${e.map(n=>{const a=(n.receiptItems||[]).filter(d=>d.name||d.unitPrice>0),i=a.reduce((d,o)=>d+(o.quantity||0)*(o.unitPrice||0),0),r=a.map(d=>`
      <div class="receipt-summary__row">
        <span class="receipt-summary__name">${v(d.name||"(항목)")}</span>
        <span class="receipt-summary__qty">${d.quantity||0}개</span>
        <span class="receipt-summary__price amount">${$((d.quantity||0)*(d.unitPrice||0))}</span>
      </div>
    `).join("");return`
      <div class="receipt-summary__round">
        <div class="receipt-summary__round-title">${v(n.name)}</div>
        ${r}
        <div class="receipt-summary__subtotal">소계 <strong class="amount">${$(i)}</strong></div>
      </div>
    `}).join("")}</div>
    </section>
  `}function lt(){return`
    <section class="section section--cta" style="animation-delay: 0.2s">
      <button class="btn btn--primary btn--lg btn--full" id="calculate-btn"
              ${s.participants.length>0&&s.rounds.length>0?"":'disabled style="opacity:0.5;cursor:not-allowed"'}>
        <i data-lucide="calculator"></i>
        정산하기
      </button>
    </section>
  `}function ut(){const{matrix:e,totals:t,notes:n}=s.result;let a='<table class="result-table"><thead><tr>';a+="<th>이름</th>",s.rounds.forEach(d=>{a+=`<th>${v(d.name)}</th>`}),a+="<th>총합</th></tr></thead><tbody>",s.participants.forEach(d=>{a+="<tr>",a+=`<td>${v(d.name)}</td>`,s.rounds.forEach(o=>{const l=e[d.id][o.id],c=o.payerId===d.id,p=vt(o,d.id);l===null?a+='<td class="not-participated">-</td>':c?a+=`<td class="amount payer-cell">${$(l)}<span class="payer-chip">결제</span>${p}</td>`:l===0?a+='<td><span class="attend-only-badge">참석만</span></td>':a+=`<td class="amount">${$(l)}${p}</td>`}),a+=`<td class="total-col amount">${$(t[d.id])}</td>`,a+="</tr>"}),a+="</tbody></table>";const{transfers:i}=s.result;let r="";return i.length===0?r='<div class="transfer-done"><i data-lucide="check-circle"></i> 모두 정산 완료!</div>':r='<div class="transfer-list">'+[...new Set(i.map(o=>o.toId))].map(o=>{const l=s.payerBankInfos[o]||{},c=w.find(m=>m.code===l.bankCode)?.name||"",p=c&&l.accountNumber,f=i.filter(m=>m.toId===o).map(m=>`
          <div class="transfer-item__row">
            <span class="transfer-item__from">${v(m.from)}</span>
            <i data-lucide="arrow-right" style="width:14px;height:14px;color:var(--accent-primary);flex-shrink:0"></i>
            <span class="transfer-item__to">${v(m.to)}</span>
            <span class="transfer-item__amount amount">${$(m.amount)}</span>
          </div>
        `).join(""),g=p?`
        <div class="transfer-item__bank">
          <div class="bank-banner">
            <div class="bank-banner__info">
              <span class="bank-banner__label">${v(c)}</span>
              <span class="bank-banner__value">${v(l.accountNumber)}</span>
            </div>
            <button class="btn-copy-bank" data-action="copy-bank" data-bank="${v(c+" "+l.accountNumber)}">
              <i data-lucide="copy" style="width:12px;height:12px"></i> 복사
            </button>
          </div>
        </div>
      `:"";return`<div class="transfer-item">${f}${g}</div>`}).join("")+"</div>",`
    <section class="section" id="result-section" style="animation-delay: 0.1s">
      <div class="section__title">
        <i data-lucide="bar-chart-3"></i>
        <span>정산 결과</span>
      </div>
      <div class="result-table-wrap">
        ${a}
      </div>

      <div id="transfer-section">
        <div class="section__title mt-4">
          <i data-lucide="send"></i>
          <span>송금 내역</span>
        </div>
        ${r}
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
  `}function pt(){const e=document.getElementById("participant-input");e&&e.addEventListener("keydown",c=>{c.key==="Enter"&&(c.preventDefault(),D())});const t=document.getElementById("add-participant-btn");t&&t.addEventListener("click",D);const n=document.getElementById("add-round-btn");n&&n.addEventListener("click",X);const a=document.getElementById("calculate-btn");a&&a.addEventListener("click",Z);const i=document.getElementById("copy-result-btn");i&&i.addEventListener("click",tt);const r=document.getElementById("share-result-btn");r&&r.addEventListener("click",et);const d=document.getElementById("reset-btn");d&&d.addEventListener("click",()=>{confirm("모든 데이터를 초기화할까요?")&&z()});const o=document.getElementById("meeting-name");o&&o.addEventListener("input",c=>{s.meetingName=c.target.value,b()});const l=document.getElementById("meeting-date");if(l&&l.addEventListener("input",c=>{s.meetingDate=c.target.value,b()}),!N){const c=document.getElementById("app");c.addEventListener("click",mt),c.addEventListener("change",ft),c.addEventListener("input",gt),c.addEventListener("blur",p=>{p.target.closest('[data-action="update-receipt-item"]')&&y()},!0),N=!0}}function mt(e){const t=e.target.closest("[data-action]");if(!t)return;switch(t.dataset.action){case"remove-participant":K(t.dataset.id);break;case"toggle-food":e.preventDefault(),e.stopPropagation(),J(parseInt(t.dataset.round),t.dataset.participant);break;case"cycle-round-drink":e.preventDefault(),e.stopPropagation(),U(parseInt(t.dataset.round),t.dataset.participant);break;case"toggle-round-participant":e.preventDefault(),Y(parseInt(t.dataset.round),t.dataset.participant);break;case"remove-round":Q(parseInt(t.dataset.round));break;case"add-receipt-item":V(parseInt(t.dataset.round));break;case"remove-receipt-item":W(parseInt(t.dataset.round),t.dataset.item);break;case"copy-bank":{const a=t.dataset.bank;navigator.clipboard.writeText(a).then(()=>{h("계좌번호 복사됨!")}).catch(()=>{const i=document.createElement("textarea");i.value=a,document.body.appendChild(i),i.select(),document.execCommand("copy"),i.remove(),h("계좌번호 복사됨!")});break}}}function ft(e){const t=e.target.closest("[data-action]");if(!t)return;switch(t.dataset.action){case"toggle-split-drink":P(parseInt(t.dataset.round),"splitDrink",t.checked);break;case"update-round":t.tagName==="SELECT"&&P(parseInt(t.dataset.round),t.dataset.field,t.value);break;case"update-payer-bank-code":{const a=t.dataset.payer;s.payerBankInfos[a]||(s.payerBankInfos[a]={}),s.payerBankInfos[a].bankCode=t.value,b();break}}}function gt(e){const t=e.target.closest("[data-action]");if(t){if(t.dataset.action==="update-payer-bank-account"){const n=t.dataset.payer;s.payerBankInfos[n]||(s.payerBankInfos[n]={}),s.payerBankInfos[n].accountNumber=t.value.replace(/[^0-9]/g,""),b();return}if(t.dataset.action==="update-receipt-item"){G(parseInt(t.dataset.round),t.dataset.item,t.dataset.field,t.value);return}if(t.dataset.action==="update-round"){const n=s.rounds.find(i=>i.id===parseInt(t.dataset.round));if(!n)return;const a=t.dataset.field;a==="totalAmount"||a==="foodAmount"||a==="drinkAmount"||a==="beverageAmount"?n[a]=parseInt(t.value)||0:a==="name"&&(n[a]=t.value),s.result=null,b()}}}function vt(e,t){if(!e.splitDrink||!e.participantIds.includes(t))return"";const n=(e.drinkerIds||[]).includes(t),a=(e.beveragerIds||[]).includes(t),i=(e.noFoodIds||[]).includes(t);if(i&&!n&&!a)return"";const r=[];return a?r.push('<span class="cell-status-badge cell-status-badge--beverage">음료</span>'):n||r.push('<span class="cell-status-badge cell-status-badge--sober">비음주</span>'),i&&r.push('<span class="cell-status-badge cell-status-badge--nofood">음식X</span>'),r.length?`<br><span class="cell-status-badges">${r.join("")}</span>`:""}function v(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}M();y();
