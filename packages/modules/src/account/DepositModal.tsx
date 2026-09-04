import { IconArrowBack } from '@oribet/assets/icons/IconArrowBack'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { CustomModal, MobileContainer } from '@oribet/ui'
import DepositContainer from './containers/DepositContainer'
import DepositFiatContainer from './containers/DepositFiatContainer'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { SettingsKeys } from '@oribet/core/util/appUtil'
import { FC, useEffect, useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize, media } from '@oribet/ui'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

interface DepositModalProps {
  setIsOpenDepositModal: (isOpen: boolean) => void
  isOpenDepositModal: boolean
  changeGlobalDepositModalFn: (isOpen: boolean) => void
}

type TabType = 'deposit_fiat' | 'deposit' | ''

const DepositModal: FC<DepositModalProps> = ({
  setIsOpenDepositModal,
  isOpenDepositModal,
  changeGlobalDepositModalFn,
}) => {
  const isMobile = useIsMobile()
  const settings = useAppSelector(state => state.settings.generalSetting)
  const systemSettings = useAppSelector(state => state.settings.systemSettings)
  const hasCryptoWallet = systemSettings?.multi_currency?.has_crypto_wallet
  const { t } = useTranslation()
  const [accountType, setAccountType] = useState<TabType>('')

  const handleChangeType = (type: TabType) => {
    setAccountType(type)
  }

  useEffect(() => {
    const hasFiat = settings.find(
      (item: any) => item.key === SettingsKeys.interkassa_transaction_status && item.value === '1'
    )

    if (hasCryptoWallet) {
      setAccountType('deposit')
    } else if (hasFiat) {
      setAccountType('deposit_fiat')
    }
  }, [hasCryptoWallet])

  const getBody = () => {
    return (
      <Root $mobile={isMobile}>
        <Header $mobile={isMobile}>
          <HeaderButtonGroup>
            {isMobile && (
              <BackIconWrapper data-testid={DEPOSIT_TEST_IDS.modal.back}>
                {/* idmap-ignore: icon click target; wrapper carries the testid */}
                <IconArrowBack
                  onClick={() => {
                    setIsOpenDepositModal(false)
                    changeGlobalDepositModalFn(false)
                  }}
                  size={16}
                />
              </BackIconWrapper>
            )}

            {hasCryptoWallet && (
              <HeaderButton
                active={accountType === 'deposit'}
                onClick={() => handleChangeType('deposit')}
                data-testid={DEPOSIT_TEST_IDS.modal.cryptoTab}
              >
                {!isMobile && <IconDeposit size={20} />}
                <span>{t('account.deposit')}</span>
              </HeaderButton>
            )}

            {settings?.find(
              (item: any) =>
                item.value === '1' && item.key === SettingsKeys.interkassa_transaction_status
            ) && (
              <HeaderButton
                active={accountType === 'deposit_fiat'}
                onClick={() => handleChangeType('deposit_fiat')}
                data-testid={DEPOSIT_TEST_IDS.modal.fiatTab}
              >
                {!isMobile && <IconDeposit size={20} />}
                <span>{t('interkasa.depositFiat')}</span>
              </HeaderButton>
            )}
          </HeaderButtonGroup>
        </Header>
        <Divider />

        {accountType === 'deposit' && hasCryptoWallet && <DepositContainer hideHeader={true} />}

        {accountType === 'deposit_fiat' &&
          settings?.find(
            (item: any) =>
              item.value === '1' && item.key === SettingsKeys.interkassa_transaction_status
          ) && <DepositFiatContainer hideHeader={true} />}
      </Root>
    )
  }

  return isMobile ? (
    isOpenDepositModal && (
      <MobileContainer
        open={isOpenDepositModal}
        setOpen={() => {
          setIsOpenDepositModal(false)
          changeGlobalDepositModalFn(false)
        }}
      >
        {getBody()}
      </MobileContainer>
    )
  ) : (
    // idmap-ignore: structural modal wrapper — inner controls carry testids
    <CustomModal
      open={isOpenDepositModal}
      onClose={() => {
        setIsOpenDepositModal(false)
        changeGlobalDepositModalFn(false)
      }}
      fullScreen={isMobile ? '80vh' : ''}
    >
      {getBody()}
    </CustomModal>
  )
}

export default DepositModal

const Root = styled.div<{ $mobile: boolean }>`
  width: ${({ $mobile }) => ($mobile ? '100%' : '857px')};
  display: flex;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg.secondary};
  flex-direction: column;
  height: ${({ $mobile }) => ($mobile ? `calc(100% - env(safe-area-inset-bottom))` : 'auto')};
  border-radius: ${({ $mobile }) => ($mobile ? '0' : '12px')};
  touch-action: pan-y; /* Only allow vertical touch actions */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling for iOS */
  overflow: hidden;
`

const Header = styled.div<{ $mobile: boolean }>`
  z-index: 1;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ $mobile, theme }) => ($mobile ? theme.colors.bg.primary : 'transparent')};

  & path {
    fill: ${({ theme }) => theme.colors.text.primary};
  }
  & span {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
    font-size: ${fontSize.lg};
    line-height: 24px;
  }
`

const HeaderButton = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 8px;
  gap: 10px;
  padding: 8px 16px 8px 12px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
  background: ${({ active, theme }) => (active ? theme.colors.surface.hover : 'transparent')};

  span {
    font-size: ${fontSize.lg};
    font-weight: 600;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  ${media.sm} {
    padding: 4px 16px 4px 12px;
    span {
      font-size: ${fontSize.base};
      font-weight: 600;
      line-height: 24px;
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }
`

const Divider = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
`

const HeaderButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const BackIconWrapper = styled.span`
  display: contents;
`

// const MobileModal = styled.div`
//   position: fixed;
//   width: 100%;
//   z-index: 99;
//   top: 0;
// `;
