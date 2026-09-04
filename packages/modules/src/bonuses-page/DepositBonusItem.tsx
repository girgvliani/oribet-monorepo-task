import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { claimDepositBonuses } from '@oribet/core/api/services/Bonus.api'
import { ActionButton, BUTTON_TYPE } from '@oribet/modules/app-sidebar'
import { useAppDispatch } from '@oribet/core/redux/hooks'
import { changeGlobalDepositModal } from '@oribet/core/redux/slices/userSlice'

import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { fontSize, cardChrome } from '@oribet/ui'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface DepositBonusItemProps {
  depositBonus: any
  initGetAllDepositBonus: () => void
  isAvailable?: boolean
}

const DepositBonusItem: FC<DepositBonusItemProps> = ({
  depositBonus,
  initGetAllDepositBonus,
  isAvailable,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [arr, setArr] = useState<number[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const bonusKey = depositBonus.id ?? depositBonus.bonus_id
  const actionId = (kind: string) => `${BONUSES_TEST_IDS.list.action}.${bonusKey}.${kind}`

  useEffect(() => {
    const res: number[] = []
    const itemNumber: number =
      depositBonus.wager_amount / depositBonus.init_amount / depositBonus.split_number
    for (let i = 0; i <= depositBonus.split_number; i++) {
      res.push(itemNumber * i)
    }
    setArr(res)
  }, [depositBonus])

  const InfoContainer = ({ keyText, value }: any) => {
    return (
      <InfoBox>
        <InfoKey>{keyText}</InfoKey>
        <InfoValue>{value}</InfoValue>
      </InfoBox>
    )
  }

  const DepositBonusButton = (type: string) => {
    switch (type) {
      case 'type1':
        return (
          <ActionButton
            color="orange"
            onClick={() => {}}
            buttonType={BUTTON_TYPE.Claim}
            data-testid={actionId('claim')}
          />
        )
      case 'type2':
        return (
          <ActionButton
            color="orange"
            onClick={() => {}}
            label={t('bonus.campaignExpired')}
            buttonType={BUTTON_TYPE.Expired}
            data-testid={actionId('info')}
            disabled
          />
        )
      case 'type3':
        return (
          <ActionButton
            color="orange"
            onClick={() => {}}
            buttonType={BUTTON_TYPE.Claim}
            data-testid={actionId('claim')}
            disabled
          />
        )
      case 'type4':
        return (
          <ActionButton
            color="green"
            onClick={() => {}}
            buttonType={BUTTON_TYPE.Finished}
            label={t('bonus.fullyClaimedBonus')}
            data-testid={actionId('info')}
            disabled
          />
          // <Button $background="#FFFFFF1A" $boxShadow="none">
          //   <DoneIcon />
          //   <ButtonText>{t('bonus.fullyClaimedBonus')}</ButtonText>
          // </Button>
        )
    }
  }

  const totalBonus = depositBonus.init_amount

  const isBonusExpired = () => {
    const expirationTimeUTC = Date.parse(depositBonus.expire_at)
    const currentTimeUTC = Date.now()
    return expirationTimeUTC < currentTimeUTC
  }

  const isFullyClaimed = () => {
    return depositBonus.wagered_amount === depositBonus.wager_amount && !depositBonus.can_claim
  }

  const getButtonType = () => {
    if (isBonusExpired()) {
      return 'type2'
    } else if (isFullyClaimed()) {
      return 'type4'
    } else if (!(depositBonus.can_claim > 0)) {
      return 'type3'
    } else {
      return 'type1'
    }
  }

  const getProgressBarItemStyle = (index: number, arrLength: number) => {
    let justifyContent = 'center'

    if (Math.ceil(arr.length / 2) === index + 1) {
      justifyContent = 'center'
    }
    if (Math.ceil(arr.length / 2) < index + 1) {
      justifyContent = 'flex-end'
    }
    if (Math.ceil(arr.length / 2) > index + 1) {
      justifyContent = 'flex-start'
    }

    if (arrLength === 2 && index === 0) justifyContent = 'flex-start'
    if (index + 1 === arr.length) justifyContent = 'flex-end'

    return justifyContent
  }

  const claim = () => {
    claimDepositBonuses({ player_bonus_id: depositBonus.id })
      .then((resp: any) => {
        if (resp.error) {
          enqueueSnackbar(resp.error.data.data.error, {
            variant: 'error',
          })
        } else {
          if (resp.success || resp.data.success) {
            enqueueSnackbar(t('bonus.claimedSuccess'), {
              variant: 'success',
            })
            initGetAllDepositBonus()
          }
        }
      })
      .catch(() => {})
  }

  const onClickBonus = () => {
    if (isAvailable) {
      dispatch(changeGlobalDepositModal(true))
      return
    }
    if (!isBonusExpired() && !isFullyClaimed() && depositBonus.can_claim > 0) {
      claim()
    }
  }

  return (
    <Root data-testid={`${BONUSES_TEST_IDS.list.card}.${bonusKey}`}>
      <FlexBox $direction="column" $gap="8px">
        <TitleText>
          {getLocalizedString(depositBonus.bonus?.name) ||
            getLocalizedString(depositBonus.name) ||
            t('bonus.bonuses')}
        </TitleText>
        <DescriptionText>{t('bonus.depositBonusDescription')}</DescriptionText>
      </FlexBox>

      {!isAvailable && (
        <>
          <ProgressBarContainer>
            <ProgressBarTrack>
              <ProgressBarFill
                $width={
                  isBonusExpired()
                    ? '0'
                    : `${(100 * depositBonus.wagered_amount) / depositBonus.wager_amount}%`
                }
                $completed={depositBonus.wagered_amount === depositBonus.wager_amount}
              />
              {!isBonusExpired() && <ProgressBarMarker />}
            </ProgressBarTrack>
            <FlexBox>
              {arr.map((item: number, index: number) => (
                <ProgressValue
                  key={item}
                  $justifyContent={getProgressBarItemStyle(index, arr.length)}
                  $color={
                    isBonusExpired() || depositBonus.split_claimed
                      ? theme.colors.text.tertiary
                      : theme.colors.text.primary
                  }
                >
                  {Math.ceil(item)}
                </ProgressValue>
              ))}
            </FlexBox>
          </ProgressBarContainer>

          <FlexBox $gap="4px">
            <InfoContainer
              keyText={depositBonus.is_percent ? t('bonus.possibleBonus') : t('bonus.totalBonus')}
              value={`${depositBonus.is_percent ? '%' : getActiveCurrencySymbol()} ${totalBonus}`}
            />
            <InfoContainer
              keyText={t('bonus.alreadyClaimed')}
              value={`${getActiveCurrencySymbol()}${depositBonus.claimed_amount}`}
            />
            <InfoContainer
              keyText={t('bonus.readyToClaim')}
              value={`${getActiveCurrencySymbol()}${depositBonus.can_claim}`}
            />
          </FlexBox>
        </>
      )}

      <div
        role="button"
        tabIndex={0}
        data-testid={actionId('trigger')}
        onClick={() => onClickBonus()}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClickBonus()
          }
        }}
      >
        {isAvailable ? (
          <ActionButton
            color="green"
            onClick={() => {}}
            buttonType={BUTTON_TYPE.Deposit}
            label={t('account.deposit')}
            data-testid={actionId('buy')}
          />
        ) : (
          DepositBonusButton(getButtonType())
        )}
      </div>
    </Root>
  )
}

// Styled components
const Root = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  padding: 12px;
  gap: 12px;
  ${cardChrome}
`

const TitleText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: Titillium Web;
  font-weight: 600;
  font-size: ${fontSize.base};
  line-height: 16px;
  letter-spacing: 0px;
`

const DescriptionText = styled.span`
  font-family: Titillium Web;
  font-weight: 400;
  font-size: ${fontSize.sm};
  line-height: 16px;
  letter-spacing: 0px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const FlexBox = styled.div<{
  $direction?: string
  $gap?: string
  $justifyContent?: string
}>`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  gap: ${props => props.$gap || '0'};
  ${props => props.$justifyContent && `justify-content: ${props.$justifyContent}`};
`

const InfoBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface.hover};
  padding: 8px;
  border-radius: 5px;
  gap: 4px;
`

const InfoKey = styled.span`
  font-weight: 400;
  font-size: ${fontSize.xs};
  line-height: 16px;
  letter-spacing: 0px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const InfoValue = styled.span`
  font-family: Titillium Web;
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
  letter-spacing: 0px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ProgressBarContainer = styled.div`
  height: 28px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const ProgressBarTrack = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface.hover};
  height: 4px;
  display: flex;
`

const ProgressBarFill = styled.div<{ $width: string; $completed: boolean }>`
  width: ${props => props.$width};
  box-shadow: ${props =>
    props.$completed
      ? `0px 0px 8px 0px ${props.theme.colors.success}`
      : `0px 0px 8px 0px ${props.theme.colors.accent.info}`};
  height: 4px;
  background: ${props =>
    props.$completed ? props.theme.colors.success : props.theme.colors.accent.info};
`

const ProgressBarMarker = styled.div`
  width: 4px;
  box-shadow: 0px 0px 8px 0px ${({ theme }) => theme.colors.accent.info};
  height: 4px;
  background: ${({ theme }) => theme.colors.text.primary};
`

const ProgressValue = styled.div<{ $justifyContent?: string; $color?: string }>`
  flex: 1;
  font-size: ${fontSize.sm};
  line-height: 12px;
  font-weight: 400;
  display: flex;
  color: ${props => props.$color || props.theme.colors.text.primary};
  justify-content: ${props => props.$justifyContent || 'flex-start'};
`

export default DepositBonusItem
