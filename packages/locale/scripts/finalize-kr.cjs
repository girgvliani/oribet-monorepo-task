#!/usr/bin/env node
/* Finalize kr.json:
 *  1. Hand-translated Korean for keys that fell back to English.
 *  2. Brand replacement: DEDPRZ/dedprz/데드프르* → ORIBET/Oribet/오리벳.
 *  3. Override bad mappings (titles that pulled the legacy brand string).
 */
const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'src', 'translations', 'kr.json')
const kr = JSON.parse(fs.readFileSync(FILE, 'utf8'))

// Korean translations for fallback / wrongly-mapped keys.
const TRANSLATIONS = {
  'app.title': 'Oribet',
  'oribetMenu.tournaments': '토너먼트',
  'header.bonus': '보너스',

  'freespin.creationFailed.title': '무료 스핀 활성화 실패',
  'freespin.creationFailed.description':
    '무료 스핀을 활성화하는 중 오류가 발생했습니다. 실제 잔액이 사용될 수 있습니다. 문제가 계속되면 고객 지원에 문의하세요.',
  'freespin.bonus': '무료 스핀 당첨금',
  'freespin.wager': '무료 스핀 당첨금 청구',
  'freespin.claimSuccess': '무료 스핀 당첨금이 성공적으로 청구되었습니다!',
  'freespin.claimFailed': '무료 스핀 당첨금 청구에 실패했습니다',

  'bonus.activeBonus': '활성 보너스',
  'bonus.queuedBonuses': '보너스 대기열',
  'bonus.claimableBonuses': '청구 가능한 보너스',
  'bonus.cancelBonus': '보너스 취소',
  'bonus.claim': '청구하기',
  'bonus.queued': '대기 중',
  'bonus.initialAmount': '초기 금액',
  'bonus.wagerMultiplier': '베팅 배수',
  'bonus.noClaimableBonuses': '청구 가능한 보너스가 없습니다',
  'bonus.freespins': '무료 스핀',
  'bonus.claimFreespin': '무료 스핀 청구',
  'bonus.selectGame': '게임 선택',
  'bonus.selectGameDesc': '무료 스핀을 사용할 게임을 선택하세요.',
  'bonus.freespinAvailable': '사용 가능한 무료 스핀',
  'bonus.viewDetails': '상세 보기',
  'bonus.continueWagering': '베팅 계속하기',
  'bonus.cancelBonusConfirmTitle': '보너스를 취소하시겠습니까?',
  'bonus.cancelBonusConfirmDesc':
    '현재 보너스를 취소하시겠습니까? 모든 진행 상황이 손실됩니다.',
  'bonus.notEnoughToClaim': '청구하기에 충분하지 않음',
  'bonus.cashUnlockBonuses': '캐시 잠금 해제 보너스',
  'bonus.activeBonuses': '활성 보너스',
  'bonus.availableBonuses': '사용 가능한 보너스',
  'bonus.minimalCashback':
    '잔액에 에어드랍되는 최소 캐시백 금액은 0.1 USDT입니다',
  'bonus.minimalCashbackTerms':
    '0.1 USDT의 캐시백을 받으려면 최소 334 USDT를 베팅해야 합니다',
  'bonus.claimAndExitBonusMode': '청구 후 보너스 모드 종료',
  'crm': '보너스',

  'newBonus.maxClaim': '최대 한도',

  'wallet.balance': '잔액',
  'wallet.exitBonusMode': '보너스 모드 종료',
  'wallet.bonusBalance': '보너스 잔액',
  'wallet.playToWager': '베팅을 위해 플레이',
  'wallet.claimBonusToWager': '베팅하려면 보너스를 청구하세요',
  'wallet.wagerProgress': '베팅 진행도',
  'wallet.transferToRealBalance': '실제 잔액으로 이체',
  'wallet.coin': '코인',
  'wallet.selectCoin': '계속하려면 코인을 선택하세요.',
  'wallet.amountToTransfer': '이체 금액',
  'wallet.estimatedReceive': '예상 수령 금액',
  'wallet.getEstimate': '견적 받기',
  'wallet.estimatedAmount': '예상 금액',
  'wallet.minimumAmount': '최소 금액',
  'wallet.estimateError': '견적을 가져오지 못했습니다. 다시 시도하세요.',
  'wallet.amountBelowMinimum': '금액이 최소 금액보다 커야 합니다',
  'wallet.payAmount': '결제 금액',
  'wallet.validUntil': '유효 기간',
  'wallet.paymentError': '결제에 실패했습니다. 다시 시도하세요.',
  'wallet.paymentSummaryMessage':
    '<bold>{{payAmount}} {{payCurrency}}</bold>를 결제하면 약 {{estimatedAmount}} {{walletCurrency}}를 받을 수 있습니다',
  'wallet.withdrawRequestCancelled': '출금 요청이 성공적으로 취소되었습니다',
  'wallet.failedToCancelWithdrawRequest': '출금 요청 취소에 실패했습니다',
  'wallet.orderCreated': '주문이 성공적으로 생성되었습니다',
  'wallet.orderFailed': '주문 생성에 실패했습니다',
  'wallet.statusCompleted': '완료',
  'wallet.statusRequested': '요청됨',
  'wallet.statusFailed': '실패',
  'wallet.statusCanceled': '취소됨',
  'wallet.depositPropagationInfo':
    '입금이 성공한 후 계정에 반영되기까지 최대 30분이 소요될 수 있습니다. 거래 내역 섹션에서 입금 상태를 확인할 수 있습니다.',
  'wallet.seeAllTransactions': '모든 거래 내역 보기',
  'wallet.oribetUSD': 'Oribet USD',
  'wallet.oribetUSDEqualToUsd': '1 Oribet USD = 1 USDT',
  'wallet.airbetUSD': 'Oribet USD',
  'wallet.airbetUSDEqualToUsd': '1 Oribet USD = 1 USD',

  'withdrawCrypto.invalidAddress':
    '유효하지 않은 출금 주소입니다. 확인 후 다시 시도하세요.',
  'withdrawCrypto.validate': '검증',
  'withdrawCrypto.confirmWithdrawal': '출금 확인',
  'withdrawCrypto.feeError': '수수료를 가져오지 못했습니다. 다시 시도하세요.',
  'withdrawCrypto.withdrawSuccess': '출금 요청이 성공적으로 제출되었습니다.',
  'withdrawCrypto.revalidationNeeded':
    '주소 또는 금액이 변경되었습니다. 다시 검증하세요.',
  'withdrawCrypto.minimumWithdrawal': '최소 출금액',
  'withdrawCrypto.selectCoin': '계속하려면 코인을 선택하세요.',
  'withdrawCrypto.extraId': '메모 / 추가 ID',

  'auth.emailPlaceholder': 'youremail@domain.com',
  'auth.welcomeTitle': 'Oribet에 오신 것을 환영합니다',

  'account.depositCrypto': '암호화폐 입금',
  'account.withdrawCrypto': '암호화폐 출금',
  'account.transferCrypto': '암호화폐 입금',
  'account.chooseDepositMethod': '입금 방법 선택',
  'account.fiat': '법정화폐',
  'account.crypto': '암호화폐',
  'account.selectWallet': '지갑 선택',

  'deposit.wantDepositBonus': '입금 보너스를 사용하고 싶습니다',
  'deposit.disableAutoBonuses': '자동 보너스 비활성화',
  'deposit.enableAutoBonuses': '자동 보너스 활성화',
  'deposit.disableAutoBonusesDesc':
    '자동 보너스 수령을 비활성화하면 실제 자금으로만 플레이하며 보너스 자금을 받지 않습니다. 토너먼트, 로열티 프로그램 보상, 보너스 제공을 포함한 모든 프로모션에서 제외됩니다. 자동 보너스 수령이 활성화되면 실제 자금과 보너스 자금 모두로 플레이할 수 있으며, 보너스 약관에 따라 모든 프로모션에 참여할 수 있습니다. 자동 보너스 수령은 현재 활성화되어 있습니다.',
  'deposit.enableAutoBonusesDesc':
    '자동 보너스 수령을 활성화하면 실제 자금과 보너스 자금 모두로 플레이할 수 있는 옵션이 생깁니다. 토너먼트, 로열티 프로그램 보상, 보너스 제공을 포함한 모든 프로모션에 적용됩니다. 자동 보너스 수령이 활성화되면 보너스 약관에 따라 모든 프로모션에 참여할 수 있습니다. 자동 보너스 수령은 현재 비활성화되어 있습니다.',

  'promoCode.enterCode': '프로모션 코드를 입력하세요',
  'promoCode.invalidCode': '유효하지 않은 코드입니다',
  'promoCode.freeSpinsGranted': '무료 스핀 지급됨',
  'promoCode.received': '수령됨',
  'promoCode.receivedAmountFromPromo':
    '프로모션 코드를 사용하여 {{amount}} USDT를 받았습니다.',
  'promoCode.receivedFreeSpinsOnGame':
    '{{gameName}}에서 {{amount}}회의 무료 스핀을 받았습니다',

  'sidebar.spin': '스핀',
  'sidebar.claim': '청구',

  'rakeBack.description': '레이크백 보너스 상세',

  'bonusMoney.headsUp': '주의.',
  'bonusMoney.buyBonusDescription':
    '베팅 요건이 있는 보너스 머니를 구매하고 있습니다. 요건이 충족되면 자유롭게 사용할 수 있는 실제 자금으로 전환됩니다.',
  'bonusMoney.bonusMoney': '보너스 머니',
  'bonusMoney.claimAndSwitchToBonusMode': '청구 후 보너스 모드로 전환',
  'bonusMoney.selectedAmount': '선택한 금액',
  'bonusMoney.bonus': '보너스',
  'bonusMoney.bonusMoneyTotal': '보너스 머니 합계',
  'bonusMoney.activateAndStartPlaying': '활성화하고 플레이 시작',
  'bonusMoney.alreadyActiveBonusDescription':
    '아직 진행 중인 보너스 머니가 있습니다. 이 새 보너스를 청구하면 현재 보너스가 취소되고 진행 상황이 초기화됩니다.',
  'bonusMoney.continueWagering': '베팅 계속하기',
  'bonusMoney.cancelBonusAndClaimNew': '보너스 취소 후 새로 청구',
  'bonusMoney.wageringComplete': '베팅 완료.',
  'bonusMoney.wageringCompleteDescription':
    '보너스를 실제 잔액으로 전환할 준비가 되었습니다. 청구를 클릭하고 자유롭게 사용하세요.',
  'bonusMoney.amountToMove': '이동 금액',
  'bonusMoney.claimAndTransferToRealBalance': '청구 후 실제 잔액으로 이체',
  'bonusMoney.bonusGettingReady': '보너스가 청구 준비 중입니다',
  'bonusMoney.bonusReadyToClaim': '보너스를 청구할 준비가 되었습니다!',
  'bonusMoney.claimBonus': '보너스 청구',
  'bonusMoney.exitBonusMode': '보너스 모드 종료',
  'bonusMoney.currentBonusBalance': '현재 보너스 잔액',
  'bonusMoney.claimPreviousBonus':
    '이전 보너스를 청구한 뒤 보너스 모드에 다시 진입하여 새 보너스를 활성화하세요.',

  'notFound.code': '404',
  'notFound.message': '페이지를 찾을 수 없습니다',
  'notFound.returnToHomepage': '홈페이지로 돌아가기',

  'gamePage.downloadForAndroid': '안드로이드용 다운로드',

  'promotions.viewAllBonuses': '모든 보너스 보기',
  'promotions.noActiveFound': '활성화된 {{category}} 프로모션이 없습니다',

  'blog.noActiveFound': '활성화된 {{category}} 블로그가 없습니다',

  'vpn.desc2': 'VPN',

  'common.error': '문제가 발생했습니다',
  'common.back': '뒤로',

  'tournaments.title': '토너먼트',
  'tournaments.ongoing': '진행 중',
  'tournaments.ended': '종료됨',
  'tournaments.viewDetails': '상세 보기',
  'tournaments.min': '분',
  'tournaments.sec': '초',
  'tournaments.empty.default': '표시할 토너먼트가 없습니다.',
  'tournaments.empty.ongoing': '현재 진행 중인 토너먼트가 없습니다.',
  'tournaments.empty.ended': '종료된 토너먼트가 아직 없습니다.',
}

// Apply hand-translations
for (const [key, value] of Object.entries(TRANSLATIONS)) {
  kr[key] = value
}

// Brand-name replacement on every value
const BRAND_REPLACEMENTS = [
  // URLs first (preserve case)
  [/dedprz\.com/g, 'oribet.com'],
  [/dedprz\.io/g, 'oribet.io'],
  // Standalone uppercase brand
  [/DEDPRZ/g, 'ORIBET'],
  // Korean transliterations of dedprz (variants)
  [/데드프르즈/g, 'Oribet'],
  [/데드프르츠/g, 'Oribet'],
  [/데드프르즀/g, 'Oribet'],
  [/데드프르/g, 'Oribet'],
  // Lowercase brand
  [/dedprz/g, 'Oribet'],
]

for (const [key, value] of Object.entries(kr)) {
  if (typeof value !== 'string') continue
  let next = value
  for (const [pattern, replacement] of BRAND_REPLACEMENTS) {
    next = next.replace(pattern, replacement)
  }
  if (next !== value) kr[key] = next
}

fs.writeFileSync(FILE, JSON.stringify(kr, null, 2) + '\n')

const en = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'translations', 'en.json'), 'utf8')
)
const remainingFallbacks = Object.keys(en).filter(k => kr[k] === en[k])
const remainingBrand = Object.entries(kr).filter(
  ([, v]) => typeof v === 'string' && /dedprz|DEDPRZ|데드프르/i.test(v)
)
console.error(
  `done. fallbacks=${remainingFallbacks.length} brand-tainted=${remainingBrand.length}`
)
if (remainingFallbacks.length) {
  console.error('still falling back:')
  remainingFallbacks.forEach(k => console.error('  ' + k))
}
if (remainingBrand.length) {
  console.error('still brand-tainted:')
  remainingBrand.forEach(([k, v]) => console.error('  ' + k + ': ' + v))
}
