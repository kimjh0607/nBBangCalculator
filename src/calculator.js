/**
 * nBBangCalculator - Settlement Calculator
 * 차수별 1/N 정산 계산 엔진
 */

/**
 * 차수별 정산 계산
 * @param {Array} participants - [{id, name}]
 * @param {Array} rounds - [{id, name, totalAmount, foodAmount, drinkAmount, splitDrink, payerId, participantIds, drinkerIds}]
 * @returns {Object} { matrix, totals, notes, transfers }
 */
export function calculateSettlement(participants, rounds) {
    // 참여자별 잔액 (양수 = 받을 돈, 음수 = 보낼 돈)
    const balances = {};
    participants.forEach(p => { balances[p.id] = 0; });

    // 차수별 참여자별 금액 매트릭스
    const matrix = {};
    participants.forEach(p => {
        matrix[p.id] = {};
        rounds.forEach(r => { matrix[p.id][r.id] = null; }); // null = 미참여
    });

    // 비고 정보
    const notes = {};
    participants.forEach(p => { notes[p.id] = []; });

    rounds.forEach(round => {
        const roundParticipants = participants.filter(p => round.participantIds.includes(p.id));
        if (roundParticipants.length === 0) return;

        let perPersonAmounts = {};

        if (round.splitDrink) {
            // 음주/비음주 분리 계산 (차수별 drinkerIds 사용)
            const foodAmount = round.foodAmount || 0;
            const drinkAmount = round.drinkAmount || 0;
            const drinkerIds = round.drinkerIds || [];
            const drinkers = roundParticipants.filter(p => drinkerIds.includes(p.id));
            const nonDrinkers = roundParticipants.filter(p => !drinkerIds.includes(p.id));
            const totalCount = roundParticipants.length;
            const drinkerCount = drinkers.length;

            // 음식값은 전원 1/N
            const foodPerPerson = totalCount > 0 ? foodAmount / totalCount : 0;

            // 술값은 음주자만 1/N
            const drinkPerDrinker = drinkerCount > 0 ? drinkAmount / drinkerCount : 0;

            roundParticipants.forEach(p => {
                if (drinkerIds.includes(p.id)) {
                    perPersonAmounts[p.id] = foodPerPerson + drinkPerDrinker;
                } else {
                    perPersonAmounts[p.id] = foodPerPerson;
                }
            });
        } else {
            // 단순 1/N
            const totalAmount = round.totalAmount || 0;
            const perPerson = roundParticipants.length > 0 ? totalAmount / roundParticipants.length : 0;
            roundParticipants.forEach(p => {
                perPersonAmounts[p.id] = perPerson;
            });
        }

        // 100원 단위 반올림
        Object.keys(perPersonAmounts).forEach(id => {
            perPersonAmounts[id] = roundToHundred(perPersonAmounts[id]);
        });

        // 매트릭스에 기록 (결제자 포함 모두 동일하게 자기 몫 표시)
        roundParticipants.forEach(p => {
            matrix[p.id][round.id] = perPersonAmounts[p.id];
        });

        // 잔액 계산
        const totalPaid = round.splitDrink
            ? (round.foodAmount || 0) + (round.drinkAmount || 0)
            : (round.totalAmount || 0);

        roundParticipants.forEach(p => {
            if (p.id === round.payerId) {
                // 결제자: 총액 - 자기 몫 = 받을 돈
                balances[p.id] += totalPaid - perPersonAmounts[p.id];
            } else {
                // 참여자: 자기 몫만큼 빚
                balances[p.id] -= perPersonAmounts[p.id];
            }
        });

        // 비고: 결제자 표시
        if (round.payerId) {
            const payerNote = `${round.name || round.id} 결제`;
            const existing = notes[round.payerId];
            if (existing && !existing.includes(payerNote)) {
                existing.push(payerNote);
            }
        }
    });

    // 비고: 차수별 비음주자 표시
    participants.forEach(p => {
        const soberRounds = rounds.filter(r =>
            r.splitDrink &&
            r.participantIds.includes(p.id) &&
            !(r.drinkerIds || []).includes(p.id)
        );
        const drinkRounds = rounds.filter(r =>
            r.splitDrink &&
            r.participantIds.includes(p.id) &&
            (r.drinkerIds || []).includes(p.id)
        );
        if (soberRounds.length > 0 && drinkRounds.length > 0) {
            // 일부 차수만 비음주
            const soberNames = soberRounds.map(r => r.name || `${r.id}차`).join('·');
            notes[p.id].push(`${soberNames} 비음주`);
        } else if (soberRounds.length > 0 && drinkRounds.length === 0) {
            notes[p.id].push('비음주');
        }
    });

    // 총합 계산
    const totals = {};
    participants.forEach(p => {
        let sum = 0;
        rounds.forEach(r => {
            const val = matrix[p.id][r.id];
            if (val !== null) sum += val;
        });
        totals[p.id] = sum;
    });

    // 최소 송금 계산
    const transfers = minimizeTransactions(balances, participants);

    return { matrix, totals, notes, transfers };
}

/**
 * 최소 송금 횟수로 정산 계산
 */
function minimizeTransactions(balances, participants) {
    const transfers = [];
    const nameMap = {};
    participants.forEach(p => { nameMap[p.id] = p.name; });

    // 채권자(받을 사람)와 채무자(보낼 사람) 분리
    let creditors = []; // {id, amount} — 양수
    let debtors = [];   // {id, amount} — 양수(절대값)

    Object.keys(balances).forEach(id => {
        const bal = roundToHundred(balances[id]);
        if (bal > 0) {
            creditors.push({ id, amount: bal });
        } else if (bal < 0) {
            debtors.push({ id, amount: Math.abs(bal) });
        }
    });

    // 금액 큰 순으로 정렬
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    // 그리디 매칭
    while (creditors.length > 0 && debtors.length > 0) {
        const creditor = creditors[0];
        const debtor = debtors[0];
        const transferAmount = Math.min(creditor.amount, debtor.amount);

        if (transferAmount > 0) {
            transfers.push({
                from: nameMap[debtor.id],
                fromId: debtor.id,
                to: nameMap[creditor.id],
                toId: creditor.id,
                amount: roundToHundred(transferAmount)
            });
        }

        creditor.amount -= transferAmount;
        debtor.amount -= transferAmount;

        if (creditor.amount <= 0) creditors.shift();
        if (debtor.amount <= 0) debtors.shift();
    }

    return transfers;
}

/**
 * 100원 단위 반올림
 */
function roundToHundred(amount) {
    return Math.round(amount / 100) * 100;
}

/**
 * 금액 포맷 (한국 원화)
 */
export function formatAmount(amount) {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('ko-KR') + '원';
}

/**
 * 카카오톡 공유용 텍스트 포맷
 */
export function formatResultText(participants, rounds, result, bankInfo = '') {
    const { transfers } = result;
    const lines = [];

    // 차수별 내역
    lines.push('🧾 차수별 내역');
    let grandTotal = 0;
    rounds.forEach(round => {
        const count = round.participantIds.length;
        const total = round.splitDrink
            ? (round.foodAmount || 0) + (round.drinkAmount || 0)
            : (round.totalAmount || 0);
        if (total === 0) return;
        grandTotal += total;
        const per = count > 0 ? Math.round(total / count / 100) * 100 : 0;
        const payer = participants.find(p => p.id === round.payerId);
        const payerStr = payer ? ` · ${payer.name} 결제` : '';
        lines.push(`${round.name}: ${formatAmount(total)} (${count}명, 1인 ${formatAmount(per)}${payerStr})`);
    });
    if (rounds.length > 1) {
        lines.push(`총 합계: ${formatAmount(grandTotal)}`);
    }

    lines.push('');
    lines.push('─────────────────');

    if (transfers.length === 0) {
        lines.push('✅ 모두 정산 완료!');
        return lines.join('\n');
    }

    lines.push('💸 송금 안내');
    if (bankInfo.trim()) {
        lines.push(`💳 ${bankInfo.trim()}`);
    }
    lines.push('');
    transfers.forEach(t => {
        lines.push(`  ${t.from} → ${formatAmount(t.amount)}`);
    });

    return lines.join('\n');
}
