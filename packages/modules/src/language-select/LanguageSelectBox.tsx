import { fontSize } from '@oribet/ui'
import { changeLanguageAndReload } from '@oribet/core/util/language'
import { IconChevronDown } from '@oribet/assets/icons/IconChevronDown'
import { Select, SelectChangeEvent } from '@oribet/ui'
import { useAppDispatch } from '@oribet/core/redux/hooks'
import { setLanguage } from '@oribet/core/redux/slices/userSlice'
import { useAvailableLanguages } from '@oribet/core/hooks/useAvailableLanguages'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled, { css, useTheme } from 'styled-components'
import { ILanguage } from '@oribet/core/types/common.type'
import { NAV_TEST_IDS } from '@oribet/test-ids'

const LanguageSelectBox = ({ isSidebarOpen }: { isSidebarOpen?: boolean }) => {
  const isMobile = useIsMobile()
  const dispatch = useAppDispatch()
  const { languages, defaultLanguage } = useAvailableLanguages()
  const [value, setValue] = useState<string>(
    () => localStorage.getItem('language') || defaultLanguage,
  )
  const { t, i18n } = useTranslation()
  const theme = useTheme()

  useEffect(() => {
    if (!localStorage.getItem('language') && defaultLanguage && value !== defaultLanguage) {
      setValue(defaultLanguage)
    }
  }, [defaultLanguage])

  useEffect(() => {
    const handleLanguageChanged = () => {
      if (value !== localStorage.getItem('language')) {
        setValue(localStorage.getItem('language') || defaultLanguage)
      }
    }
    i18n.on('languageChanged', handleLanguageChanged)

    if (isMobile && localStorage.getItem('language') !== value) {
      setValue(localStorage.getItem('language') || value)
    }

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string
    setValue(newValue)
    dispatch(setLanguage(newValue))
    // Persist to the backend, then rewrite the URL + reload (see changeLanguageAndReload).
    changeLanguageAndReload(newValue)
  }

  const languageData = languages.map((item: ILanguage) => ({
    value: item.value,
    renderer: () => (
      <LanguageItem $isSelected={value === item.value}>
        {item.icon && <item.icon />}
        {item.label}
      </LanguageItem>
    ),
  }))

  return (
    <StyledSelectContainer $isSidebarOpen={isSidebarOpen}>
      <Select
        value={value}
        onChange={handleChange}
        testId={NAV_TEST_IDS.languageSelect}
        data={languageData}
        align={isSidebarOpen ? 'left' : 'right'}
        displayEmpty
        renderValue={selectedValue => {
          const selectedLanguage = languages.find(item => item.value === selectedValue)
          return (
            <SelectRenderContainer $isSidebarOpen={isSidebarOpen}>
              <SelectRenderContainerLeft>
                {selectedLanguage?.icon && (
                  <SelectRenderContainerIcon>
                    <selectedLanguage.icon />
                  </SelectRenderContainerIcon>
                )}
                {isSidebarOpen && t('settings.language')}
              </SelectRenderContainerLeft>
              {isSidebarOpen && selectedLanguage?.value && (
                <SelectRenderContainerRight>
                  {selectedLanguage.value.toUpperCase()}
                </SelectRenderContainerRight>
              )}
            </SelectRenderContainer>
          )
        }}
        IconComponent={() => {
          return isSidebarOpen ? (
            <IconChevronDown size={16} style={{ color: theme.colors.text.secondary }} />
          ) : null
        }}
      />
    </StyledSelectContainer>
  )
}

const SelectRenderContainer = styled.div<{ $isSidebarOpen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isSidebarOpen }) => ($isSidebarOpen ? 'space-between' : 'center')};
  width: 100%;
`

const SelectRenderContainerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: ${fontSize.base};
  line-height: 24px;
  letter-spacing: 0px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const SelectRenderContainerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  overflow: hidden;

  & svg {
    width: 16px;
    height: 16px;
  }
`

const SelectRenderContainerRight = styled.div`
  font-family: Titillium Web;
  font-weight: 600;
  font-size: ${fontSize.base};
  line-height: 24px;
  letter-spacing: 0px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const StyledSelectContainer = styled.div<{ $isSidebarOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  /* Full width in the sidebar; compact (content width) in the header so it never
     expands and pushes itself off-screen. */
  width: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '100%' : 'auto')};
  flex-shrink: 0;
  gap: 4px;
  box-sizing: border-box;

  & > div {
    height: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '40px' : '32px')};
    border: none;
    background: transparent;
    box-shadow: none;
    padding: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '0 8px' : '0')};

    &:hover {
      background: transparent;
    }

    ${({ $isSidebarOpen }) =>
      !$isSidebarOpen &&
      css`
        min-width: auto;
        width: 32px;
        padding: 0;
        justify-content: center;
      `}
  }
`

const LanguageItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.text.primary : theme.colors.text.tertiary};
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  transition: color 0.3s ease-in-out;

  & svg {
    width: 16px;
    height: 16px;
  }
`

export default LanguageSelectBox
