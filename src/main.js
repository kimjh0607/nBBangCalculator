import './style.css';
import { calculateSettlement, formatAmount, formatResultText } from './calculator.js';
import html2canvas from 'html2canvas';

// ============================================
// State
// ============================================
let state = {
  meetingName: '',
  meetingDate: new Date().toISOString().split('T')[0],
  payerBankInfos: {},  // { participantId: '계좌문자열' }
  participants: [],
  rounds: [],
  result: null,
  nextParticipantId: 1,
  nextRoundId: 1,
};

// ============================================
// ID Generators
// ============================================
function genParticipantId() { return `p${state.nextParticipantId++}`; }
function genRoundId() { return state.nextRoundId++; }

// ============================================
// State Persistence
// ============================================
function saveState() {
  try {
    localStorage.setItem('splitEasy_state', JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

function loadState() {
  try {
    const saved = localStorage.getItem('splitEasy_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    }
  } catch (e) { /* ignore */ }
}

function resetState() {
  localStorage.removeItem('splitEasy_state');
  state = {
    meetingName: '',
    meetingDate: new Date().toISOString().split('T')[0],
    payerBankInfos: {},
    participants: [],
    rounds: [],
    result: null,
    nextParticipantId: 1,
    nextRoundId: 1,
  };
  render();
}

// ============================================
// Toast
// ============================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons({ nodes: [toast] });
  setTimeout(() => {
    toast.style.animation = 'toastOut 300ms ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ============================================
// Event Handlers
// ============================================
function addParticipant() {
  const input = document.getElementById('participant-input');
  const name = input.value.trim();
  if (!name) return;
  if (state.participants.some(p => p.name === name)) {
    showToast('이미 추가된 이름입니다', 'info');
    return;
  }
  state.participants.push({
    id: genParticipantId(),
    name
  });
  state.result = null;
  saveState();
  render();
  document.getElementById('participant-input').focus();
}

function removeParticipant(id) {
  state.participants = state.participants.filter(p => p.id !== id);
  // 차수에서도 제거
  state.rounds.forEach(r => {
    r.participantIds = r.participantIds.filter(pid => pid !== id);
    r.drinkerIds = (r.drinkerIds || []).filter(pid => pid !== id);
    r.beveragerIds = (r.beveragerIds || []).filter(pid => pid !== id);
    if (r.payerId === id) r.payerId = null;
  });
  state.result = null;
  saveState();
  render();
}

function cycleRoundDrinkStatus(roundId, participantId) {
  const round = state.rounds.find(r => r.id === roundId);
  if (!round) return;
  if (!round.drinkerIds) round.drinkerIds = [];
  if (!round.beveragerIds) round.beveragerIds = [];

  const isDrinker = round.drinkerIds.includes(participantId);
  const isBeverager = round.beveragerIds.includes(participantId);

  if (isDrinker) {
    // 🍺 → 🥤
    round.drinkerIds = round.drinkerIds.filter(id => id !== participantId);
    round.beveragerIds.push(participantId);
  } else if (isBeverager) {
    // 🥤 → 🚫
    round.beveragerIds = round.beveragerIds.filter(id => id !== participantId);
  } else {
    // 🚫 → 🍺
    round.drinkerIds.push(participantId);
  }
  state.result = null;
  saveState();
  render();
}

function addRound() {
  const roundNum = genRoundId();
  const displayNum = state.rounds.length + 1;
  // 이전 차수 참여자를 기본 체크
  const prevRound = state.rounds[state.rounds.length - 1];
  const defaultParticipants = prevRound
    ? [...prevRound.participantIds]
    : state.participants.map(p => p.id);

  state.rounds.push({
    id: roundNum,
    name: `${displayNum}차`,
    totalAmount: 0,
    foodAmount: 0,
    drinkAmount: 0,
    beverageAmount: 0,
    splitDrink: false,
    payerId: state.participants.length > 0 ? state.participants[0].id : null,
    participantIds: defaultParticipants,
    drinkerIds: [...defaultParticipants],  // 기본: 전원 음주
    beveragerIds: [],
  });
  state.result = null;
  saveState();
  render();

  // 스크롤 to new round
  setTimeout(() => {
    const cards = document.querySelectorAll('.round-card');
    const last = cards[cards.length - 1];
    if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function removeRound(roundId) {
  state.rounds = state.rounds.filter(r => r.id !== roundId);
  state.result = null;
  saveState();
  render();
}

function updateRound(roundId, field, value) {
  const round = state.rounds.find(r => r.id === roundId);
  if (!round) return;

  if (field === 'totalAmount' || field === 'foodAmount' || field === 'drinkAmount' || field === 'beverageAmount') {
    round[field] = parseInt(value) || 0;
  } else if (field === 'splitDrink') {
    round[field] = value;
    if (value && round.totalAmount > 0 && round.foodAmount === 0) {
      // 토글 ON 시 총액을 음식값으로 이동
      round.foodAmount = round.totalAmount;
      round.totalAmount = 0;
    } else if (!value && round.foodAmount > 0) {
      // 토글 OFF 시 음식+술 합산
      round.totalAmount = round.foodAmount + round.drinkAmount;
      round.foodAmount = 0;
      round.drinkAmount = 0;
    }
  } else if (field === 'name') {
    round[field] = value;
  } else {
    round[field] = value;
  }
  state.result = null;
  saveState();
  render();
}

function toggleRoundParticipant(roundId, participantId) {
  const round = state.rounds.find(r => r.id === roundId);
  if (!round) return;
  const idx = round.participantIds.indexOf(participantId);
  if (idx >= 0) {
    round.participantIds.splice(idx, 1);
  } else {
    round.participantIds.push(participantId);
  }
  state.result = null;
  saveState();
  render();
}

function doCalculate() {
  if (state.participants.length === 0) {
    showToast('참여자를 추가해주세요', 'info');
    return;
  }
  if (state.rounds.length === 0) {
    showToast('차수를 추가해주세요', 'info');
    return;
  }
  state.result = calculateSettlement(state.participants, state.rounds);
  saveState();
  render();

  setTimeout(() => {
    const resultEl = document.getElementById('result-section');
    if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function copyResult() {
  if (!state.result) return;
  const text = formatResultText(state.participants, state.rounds, state.result, state.payerBankInfos);

  // 모임 이름 추가
  const header = state.meetingName
    ? `📋 [${state.meetingName}] 정산 결과  ${state.meetingDate}\n\n`
    : '';

  navigator.clipboard.writeText(header + text).then(() => {
    showToast('클립보드에 복사되었습니다!');
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = header + text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('클립보드에 복사되었습니다!');
  });
}

async function shareResult() {
  if (!state.result) return;

  const text = formatResultText(state.participants, state.rounds, state.result, state.payerBankInfos);
  const header = state.meetingName
    ? `📋 [${state.meetingName}] 정산 결과  ${state.meetingDate}\n\n`
    : `📋 정산 결과  ${state.meetingDate}\n\n`;
  const fullText = header + text;

  const shareBtn = document.getElementById('share-result-btn');
  const originalHtml = shareBtn?.innerHTML;
  if (shareBtn) {
    shareBtn.disabled = true;
    shareBtn.innerHTML = `<i data-lucide="loader-circle" style="width:16px;height:16px;animation:spin 1s linear infinite"></i> 준비 중...`;
    lucide.createIcons({ nodes: [shareBtn] });
  }

  try {
    const resultEl = document.getElementById('result-section');
    await document.fonts.ready;

    // 캡처용 래퍼에 패딩 추가
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:fixed;top:-9999px;left:-9999px;padding:24px;background:#0d1117;';
    const clone = resultEl.cloneNode(true);
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(wrapper, {
      backgroundColor: '#0d1117',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    document.body.removeChild(wrapper);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], '정산결과.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: fullText });
    } else if (navigator.share) {
      await navigator.share({ text: fullText });
    } else {
      // PC 폴백: 이미지 다운로드 + 텍스트 복사
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '정산결과.png';
      a.click();
      URL.revokeObjectURL(url);
      navigator.clipboard.writeText(fullText).catch(() => {});
      showToast('이미지 저장 + 텍스트 복사 완료!');
    }
  } catch (err) {
    if (err?.name !== 'AbortError') {
      // 이미지 캡처 실패 시 텍스트만 공유
      if (navigator.share) {
        navigator.share({ text: fullText }).catch(() => {});
      } else {
        navigator.clipboard.writeText(fullText).catch(() => {});
        showToast('클립보드에 복사되었습니다!');
      }
    }
  } finally {
    if (shareBtn && originalHtml) {
      shareBtn.disabled = false;
      shareBtn.innerHTML = originalHtml;
      lucide.createIcons({ nodes: [shareBtn] });
    }
  }
}

// ============================================
// Render
// ============================================
function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    ${renderMeetingInfo()}
    ${renderParticipants()}
    ${renderRounds()}
    ${renderPayerBankInfos()}
    ${renderCalculateButton()}
    ${state.result ? renderResult() : ''}
  `;

  // Bind events
  bindEvents();

  // Init Lucide icons
  lucide.createIcons();
}

function renderHeader() {
  return `
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
  `;
}

function renderMeetingInfo() {
  return `
    <section class="section" style="animation-delay: 0.05s">
      <div class="section__title">
        <i data-lucide="calendar"></i>
        <span>모임 정보</span>
      </div>
      <div class="card">
        <div class="input-field">
          <label>모임 이름</label>
          <input type="text" id="meeting-name" placeholder="예: 팀 회식"
                 value="${escapeHtml(state.meetingName)}" />
        </div>
        <div class="input-field mt-3">
          <label>날짜</label>
          <input type="date" id="meeting-date" value="${state.meetingDate}" />
        </div>
      </div>
    </section>
  `;
}

function renderPayerBankInfos() {
  // 차수에서 실제 결제자 목록 추출 (중복 제거)
  const payerIds = [...new Set(state.rounds.map(r => r.payerId).filter(Boolean))];
  if (payerIds.length === 0) return '';

  const inputs = payerIds.map(pid => {
    const p = state.participants.find(p => p.id === pid);
    if (!p) return '';
    return `
      <div class="input-field mt-3">
        <label>💳 ${escapeHtml(p.name)} 계좌</label>
        <input type="text"
               data-action="update-payer-bank" data-payer="${pid}"
               value="${escapeHtml(state.payerBankInfos[pid] || '')}"
               placeholder="은행명 ****-**-**** ${escapeHtml(p.name)}" />
      </div>
    `;
  }).join('');

  return `
    <section class="section" style="animation-delay: 0.08s">
      <div class="section__title">
        <i data-lucide="credit-card"></i>
        <span>결제자 계좌</span>
        <span class="text-muted text-sm">(선택)</span>
      </div>
      <div class="card">
        <p class="text-muted text-sm mb-2">입력하면 정산 결과 공유 시 계좌번호가 함께 전송돼요.<br><span style="color:var(--text-tertiary)">건너뛰어도 정산 계산에는 영향 없어요.</span></p>
        ${inputs}
      </div>
    </section>
  `;
}

function renderParticipants() {
  const chips = state.participants.map(p => `
    <div class="chip" data-id="${p.id}">
      <span>${escapeHtml(p.name)}</span>
      <button class="chip__remove" data-action="remove-participant" data-id="${p.id}" title="삭제">×</button>
    </div>
  `).join('');

  return `
    <section class="section" style="animation-delay: 0.1s">
      <div class="section__title">
        <i data-lucide="users"></i>
        <span>참여자</span>
        ${state.participants.length > 0 ? `<span class="text-muted text-sm">(${state.participants.length}명)</span>` : ''}
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
        ${state.participants.length > 0 ? `
          <div class="chip-list">${chips}</div>
        ` : `
          <div class="empty-state mt-3">
            <div class="empty-state__icon">👥</div>
            <p>참여자를 추가해주세요</p>
          </div>
        `}
      </div>
    </section>
  `;
}

function renderRounds() {
  const roundCards = state.rounds.map((round, idx) => renderRoundCard(round, idx)).join('');

  const emptyState = state.rounds.length === 0 ? `
    <div class="card round-empty-state">
      <div class="empty-state__icon">🧾</div>
      <p style="font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-1)">아직 추가된 차수가 없어요</p>
      <p class="text-sm text-muted">1차 식당, 2차 술집처럼<br>자리가 바뀔 때마다 차수를 추가하세요.<br>한 곳만 갔다면 1차만 추가하면 돼요.</p>
    </div>
  ` : '';

  return `
    <section class="section" style="animation-delay: 0.15s">
      <div class="section__title">
        <i data-lucide="receipt"></i>
        <span>차수별 지출</span>
      </div>
      ${emptyState}
      ${roundCards}
      <button class="btn btn--secondary btn--full" id="add-round-btn"
              ${state.participants.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
        <i data-lucide="plus-circle"></i>
        차수 추가
      </button>
      ${state.participants.length === 0 ? `<p class="text-muted text-sm" style="text-align:center;margin-top:var(--space-2)">참여자를 먼저 추가해야 차수를 추가할 수 있어요</p>` : ''}
    </section>
  `;
}

function renderRoundCard(round, idx) {
  const drinkerIds = round.drinkerIds || [];
  const beveragerIds = round.beveragerIds || [];

  // 참여자 체크리스트
  const participantChecks = state.participants.map(p => {
    const checked = round.participantIds.includes(p.id);
    const isDrinker = drinkerIds.includes(p.id);
    const isBeverager = beveragerIds.includes(p.id);
    const drinkStatus = isDrinker ? 'drinker' : isBeverager ? 'beverage' : 'sober';
    const drinkIcon = isDrinker ? '🍺' : isBeverager ? '🥤' : '🚫';
    const drinkText = isDrinker ? '음주' : isBeverager ? '음료' : '없음';
    return `
      <label class="check-item ${checked ? 'check-item--checked' : ''}"
             data-action="toggle-round-participant"
             data-round="${round.id}" data-participant="${p.id}">
        <input type="checkbox" ${checked ? 'checked' : ''} />
        <span class="check-item__box">
          <svg viewBox="0 0 14 14"><polyline points="2 7 5.5 10.5 12 4"></polyline></svg>
        </span>
        <span>${escapeHtml(p.name)}</span>
        ${round.splitDrink && checked ? `
          <span class="drink-toggle drink-toggle--${drinkStatus}"
                data-action="cycle-round-drink"
                data-round="${round.id}" data-participant="${p.id}"
                title="클릭해서 변경">
            ${drinkIcon} ${drinkText}
          </span>
        ` : ''}
      </label>
    `;
  }).join('');

  // 결제자 옵션
  const payerOptions = state.participants.map(p =>
    `<option value="${p.id}" ${round.payerId === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`
  ).join('');

  const amountInput = round.splitDrink
    ? `
      <div class="split-input">
        <div class="input-field">
          <label>🍔 음식값</label>
          <input type="number" data-action="update-round" data-round="${round.id}" data-field="foodAmount"
                 value="${round.foodAmount || ''}" placeholder="0" inputmode="numeric" />
        </div>
        <div class="input-field">
          <label>🍺 술값</label>
          <input type="number" data-action="update-round" data-round="${round.id}" data-field="drinkAmount"
                 value="${round.drinkAmount || ''}" placeholder="0" inputmode="numeric" />
        </div>
        <div class="input-field">
          <label>🥤 음료값</label>
          <input type="number" data-action="update-round" data-round="${round.id}" data-field="beverageAmount"
                 value="${round.beverageAmount || ''}" placeholder="0" inputmode="numeric" />
        </div>
      </div>
    `
    : `
      <div class="input-field">
        <label>총 금액</label>
        <input type="number" data-action="update-round" data-round="${round.id}" data-field="totalAmount"
               value="${round.totalAmount || ''}" placeholder="0" inputmode="numeric" />
      </div>
    `;

  // 차수에서 음주 구분 활성화 시 안내
  const drinkHint = round.splitDrink
    ? `<p class="text-muted text-sm mt-2" style="padding-left:2px"><span style="color:var(--text-tertiary);font-size:var(--font-size-xs)">아이콘을 클릭할 때마다 순환돼요: 🍺 음주 → 🥤 음료 → 🚫 없음(음식만)</span></p>`
    : '';

  return `
    <div class="round-card" style="animation-delay: ${0.05 * idx}s">
      <div class="round-card__header">
        <div class="round-card__title">
          <span class="round-card__number">${idx + 1}</span>
          <input type="text" value="${escapeHtml(round.name)}"
                 data-action="update-round" data-round="${round.id}" data-field="name"
                 style="background:transparent;border:none;color:var(--text-primary);font-size:var(--font-size-lg);font-weight:700;font-family:var(--font-family);width:100px;padding:0" />
        </div>
        <button class="round-card__delete" data-action="remove-round" data-round="${round.id}" title="삭제">
          <i data-lucide="trash-2" style="width:16px;height:16px"></i>
        </button>
      </div>

      <div class="round-card__body">
        <div>
          <div>
            <div class="round-card__field-label">💳 결제자</div>
            <p class="text-muted text-sm" style="margin-bottom:var(--space-2)">이 자리에서 <strong style="color:var(--text-secondary)">실제로 카드·현금으로 계산한 사람</strong>을 선택하세요</p>
            <select data-action="update-round" data-round="${round.id}" data-field="payerId">
              ${payerOptions}
            </select>
          </div>
        </div>

        <div>
          <div class="flex-between mb-2">
            <span class="round-card__field-label" style="margin-bottom:0">금액</span>
            <label class="toggle-wrap">
              <span class="toggle-wrap__label" title="술을 안 마시는 사람과 따로 계산하고 싶을 때 켜세요">음주/비음주 구분 <span style="font-size:var(--font-size-xs);color:var(--text-tertiary)">(?)</span></span>
              <span class="toggle">
                <input type="checkbox" ${round.splitDrink ? 'checked' : ''}
                       data-action="toggle-split-drink" data-round="${round.id}" />
                <span class="toggle__slider"></span>
              </span>
            </label>
          </div>
          ${!round.splitDrink ? `<p class="text-muted text-sm" style="margin-bottom:var(--space-2)">총 금액을 입력하면 참여자 수로 자동 1/N 계산해요</p>` : `<p class="text-muted text-sm" style="margin-bottom:var(--space-2)">음식·술·음료값을 따로 입력하면 음주 여부에 따라 나눠서 계산해요</p>`}
          ${amountInput}
        </div>

        <div>
          <div class="round-card__field-label">참여자</div>
          <p class="text-muted text-sm" style="margin-bottom:var(--space-2)">${round.splitDrink ? '이 차수에 함께한 사람을 체크하고, 옆 아이콘을 눌러 음주 여부를 설정하세요' : '이 차수에 함께한 사람만 체크하세요'}</p>
          <div class="check-group">
            ${participantChecks}
          </div>
          ${drinkHint}
        </div>
      </div>
    </div>
  `;
}

function renderCalculateButton() {
  const canCalculate = state.participants.length > 0 && state.rounds.length > 0;
  return `
    <section class="section section--cta" style="animation-delay: 0.2s">
      <button class="btn btn--primary btn--lg btn--full" id="calculate-btn"
              ${!canCalculate ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
        <i data-lucide="calculator"></i>
        정산하기
      </button>
    </section>
  `;
}

function renderResult() {
  const { matrix, totals, notes } = state.result;

  // 테이블
  let tableHtml = '<table class="result-table"><thead><tr>';
  tableHtml += '<th>이름</th>';
  state.rounds.forEach(r => {
    tableHtml += `<th>${escapeHtml(r.name)}</th>`;
  });
  tableHtml += '<th>총합</th><th style="text-align:left">비고</th></tr></thead><tbody>';

  state.participants.forEach(p => {
    tableHtml += '<tr>';
    tableHtml += `<td>${escapeHtml(p.name)}</td>`;
    state.rounds.forEach(r => {
      const val = matrix[p.id][r.id];
      const isPayer = r.payerId === p.id;
      if (val === null) {
        tableHtml += '<td class="not-participated">-</td>';
      } else if (isPayer) {
        tableHtml += `<td class="amount payer-cell">${formatAmount(val)}<span class="payer-chip">결제</span></td>`;
      } else if (val === 0) {
        tableHtml += '<td style="color:var(--success)">0원</td>';
      } else {
        tableHtml += `<td class="amount">${formatAmount(val)}</td>`;
      }
    });
    tableHtml += `<td class="total-col amount">${formatAmount(totals[p.id])}</td>`;
    tableHtml += `<td class="note-col">${escapeHtml((notes[p.id] || []).join(', '))}</td>`;
    tableHtml += '</tr>';
  });
  tableHtml += '</tbody></table>';

  return `
    <section class="section" id="result-section" style="animation-delay: 0.1s">
      <div class="section__title">
        <i data-lucide="bar-chart-3"></i>
        <span>정산 결과</span>
      </div>
      <div class="result-table-wrap">
        ${tableHtml}
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
  `;
}

// ============================================
// Event Binding
// ============================================
function bindEvents() {
  // Participant input enter
  const participantInput = document.getElementById('participant-input');
  if (participantInput) {
    participantInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); addParticipant(); }
    });
  }

  // Add participant btn
  const addBtn = document.getElementById('add-participant-btn');
  if (addBtn) addBtn.addEventListener('click', addParticipant);

  // Add round btn
  const addRoundBtn = document.getElementById('add-round-btn');
  if (addRoundBtn) addRoundBtn.addEventListener('click', addRound);

  // Calculate btn
  const calcBtn = document.getElementById('calculate-btn');
  if (calcBtn) calcBtn.addEventListener('click', doCalculate);

  // Copy result btn
  const copyBtn = document.getElementById('copy-result-btn');
  if (copyBtn) copyBtn.addEventListener('click', copyResult);

  // Share result btn
  const shareBtn = document.getElementById('share-result-btn');
  if (shareBtn) shareBtn.addEventListener('click', shareResult);

  // Reset btn
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (confirm('모든 데이터를 초기화할까요?')) resetState();
  });

  // Meeting info
  const meetingName = document.getElementById('meeting-name');
  if (meetingName) {
    meetingName.addEventListener('input', e => {
      state.meetingName = e.target.value;
      saveState();
    });
  }
  const meetingDate = document.getElementById('meeting-date');
  if (meetingDate) {
    meetingDate.addEventListener('input', e => {
      state.meetingDate = e.target.value;
      saveState();
    });
  }


  // Delegated events
  document.getElementById('app').addEventListener('click', handleDelegatedClick);
  document.getElementById('app').addEventListener('change', handleDelegatedChange);
  document.getElementById('app').addEventListener('input', handleDelegatedInput);
}

function handleDelegatedClick(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;

  switch (action) {
    case 'remove-participant':
      removeParticipant(target.dataset.id);
      break;
    case 'cycle-round-drink':
      e.preventDefault();
      e.stopPropagation();
      cycleRoundDrinkStatus(parseInt(target.dataset.round), target.dataset.participant);
      break;
    case 'toggle-round-participant':
      e.preventDefault();
      toggleRoundParticipant(parseInt(target.dataset.round), target.dataset.participant);
      break;
    case 'remove-round':
      removeRound(parseInt(target.dataset.round));
      break;
    case 'copy-bank': {
      const text = target.dataset.bank;
      navigator.clipboard.writeText(text).then(() => {
        showToast('계좌번호 복사됨!');
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToast('계좌번호 복사됨!');
      });
      break;
    }
  }
}

function handleDelegatedChange(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case 'toggle-split-drink':
      updateRound(parseInt(target.dataset.round), 'splitDrink', target.checked);
      break;
    case 'update-round':
      // input 요소는 handleDelegatedInput에서 이미 처리됨 (re-render 없이)
      // select 요소(결제자 변경)만 re-render 필요
      if (target.tagName === 'SELECT') {
        updateRound(parseInt(target.dataset.round), target.dataset.field, target.value);
      }
      break;
  }
}

function handleDelegatedInput(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  if (target.dataset.action === 'update-payer-bank') {
    state.payerBankInfos[target.dataset.payer] = target.value;
    state.result = null;
    saveState();
    return;
  }
  if (target.dataset.action === 'update-round') {
    const round = state.rounds.find(r => r.id === parseInt(target.dataset.round));
    if (!round) return;
    const field = target.dataset.field;
    if (field === 'totalAmount' || field === 'foodAmount' || field === 'drinkAmount' || field === 'beverageAmount') {
      round[field] = parseInt(target.value) || 0;
    } else if (field === 'name') {
      round[field] = target.value;
    }
    state.result = null;
    saveState();
  }
}

// ============================================
// Utils
// ============================================
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================
// Init
// ============================================
loadState();
render();
