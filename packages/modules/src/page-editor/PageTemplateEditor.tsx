import { fontSize } from '@oribet/ui'
import { IconArrowBack } from '@oribet/assets/icons/IconArrowBack'
import { IconBin } from '@oribet/assets/icons/IconBin'
import { IconClose } from '@oribet/assets/icons/IconClose'
import { IconDragHandle } from '@oribet/assets/icons/IconDragHandle'
import { IconPlus } from '@oribet/assets/icons/IconPlus'
import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useActivePageId } from './ActivePageContext'
import { moduleRegistry } from './moduleRegistry'
import { pageRegistry } from './pageRegistry'
import { usePageTemplate } from './usePageTemplate'
import type { AuthVisibility, ModuleInstance } from './types'

interface PageTemplateEditorProps {
  onBack: () => void
  onClose: () => void
}

const VISIBILITY_OPTIONS: { value: AuthVisibility; label: string }[] = [
  { value: 'always', label: 'Always' },
  { value: 'auth', label: 'Authed' },
  { value: 'unauth', label: 'Unauthed' },
]

const PageTemplateEditor = ({ onBack, onClose }: PageTemplateEditorProps) => {
  const theme = useTheme()
  const activePageId = useActivePageId()
  // Hooks must run unconditionally; falls back to "lobby" so the hook stays valid
  // when no editable page is mounted. UI handles the unsupported-page case below.
  const page = usePageTemplate(activePageId ?? 'lobby')
  const [pickerOpen, setPickerOpen] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const isSupportedPage = !!activePageId && !!pageRegistry[activePageId]

  const handleDragEnd = (event: DragEndEvent) => {
    if (!page) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    page.reorderInstances(String(active.id), String(over.id))
  }

  return (
    <Root>
      <Header>
        <BackButton onClick={onBack}>
          <IconArrowBack style={{ color: theme.colors.text.primary }} />
        </BackButton>
        <Title>EDIT PAGE TEMPLATE</Title>
        <CloseIcon onClick={onClose}>
          <IconClose style={{ color: theme.colors.text.primary }} />
        </CloseIcon>
      </Header>
      <Body>
        {!isSupportedPage || !page ? (
          <EmptyState>
            <EmptyTitle>This page isn&apos;t editable yet</EmptyTitle>
            <EmptySub>Navigate to the lobby to try out the page template editor.</EmptySub>
          </EmptyState>
        ) : (
          <>
            <ActivePageBanner>
              <BannerLabel>EDITING</BannerLabel>
              <BannerValue>{page.label}</BannerValue>
            </ActivePageBanner>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={page.instances.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <List>
                  {page.instances.map(instance => (
                    <SortableRow
                      key={instance.id}
                      instance={instance}
                      onRemove={() => page.removeInstance(instance.id)}
                      onChangeVisibility={v => page.setVisibility(instance.id, v)}
                      visibility={page.visibilityOf(instance.id)}
                      accent={theme.colors.accent.brand}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>

            <AddSection>
              <AddButton onClick={() => setPickerOpen(o => !o)}>
                <IconPlus size={16} />
                <span>Add Module</span>
              </AddButton>
              {pickerOpen && (
                <Picker>
                  {page.allowedModules.map(moduleId => {
                    const entry = moduleRegistry[moduleId]
                    if (!entry) return null
                    return (
                      <PickerItem
                        key={moduleId}
                        onClick={() => {
                          page.addModule(moduleId)
                          setPickerOpen(false)
                        }}
                      >
                        {entry.label}
                      </PickerItem>
                    )
                  })}
                </Picker>
              )}
            </AddSection>

            <ResetButton onClick={page.resetToDefault}>Reset to Default</ResetButton>
          </>
        )}
      </Body>
    </Root>
  )
}

export default PageTemplateEditor

interface SortableRowProps {
  instance: ModuleInstance
  visibility: AuthVisibility
  accent: string
  onRemove: () => void
  onChangeVisibility: (v: AuthVisibility) => void
}

const SortableRow = ({
  instance,
  visibility,
  accent,
  onRemove,
  onChangeVisibility,
}: SortableRowProps) => {
  const entry = moduleRegistry[instance.moduleId]
  const supportsAuth = !!entry?.supports?.auth
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: instance.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1 : undefined,
  }

  return (
    <Row ref={setNodeRef} style={style}>
      <RowMain>
        <DragHandle {...attributes} {...listeners} aria-label="Drag to reorder">
          <IconDragHandle size={18} />
        </DragHandle>
        <ModuleLabel>{entry?.label ?? instance.moduleId}</ModuleLabel>
        <RowActions>
          <DeleteButton onClick={onRemove} aria-label="Remove module">
            <IconBin size={16} />
          </DeleteButton>
        </RowActions>
      </RowMain>
      {supportsAuth && (
        <Segmented>
          {VISIBILITY_OPTIONS.map(opt => (
            <Segment
              key={opt.value}
              $isActive={visibility === opt.value}
              $accentColor={accent}
              onClick={() => onChangeVisibility(opt.value)}
            >
              {opt.label}
            </Segment>
          ))}
        </Segmented>
      )}
    </Row>
  )
}

const Root = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

const Header = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: ${({ theme }) => theme.colors.bg.primary};
  box-shadow: ${({ theme }) => theme.colors.shadow.header};
  min-height: 64px;
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-sizing: border-box;
`

const BackButton = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Title = styled.span`
  flex: 1;
  font-size: ${fontSize.base};
  font-weight: 700;
  text-transform: uppercase;
`

const CloseIcon = styled.span`
  cursor: pointer;
`

const Body = styled.div`
  height: 100%;
  overflow: auto;
  padding: 16px;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ActivePageBanner = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface.hover};
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
`

const BannerLabel = styled.span`
  font-size: ${fontSize.xs};
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const BannerValue = styled.span`
  font-size: ${fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface.hover};
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
`

const RowMain = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const DragHandle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 4px;
  border-radius: 4px;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`

const ModuleLabel = styled.span`
  flex: 1;
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const RowActions = styled.div`
  display: flex;
  gap: 4px;
`

const DeleteButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.active};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`

const Segmented = styled.div`
  display: flex;
  gap: 4px;
`

const Segment = styled.div<{ $isActive: boolean; $accentColor: string }>`
  flex: 1;
  text-align: center;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: ${fontSize.xs};
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  border: 1px solid
    ${({ $isActive, $accentColor, theme }) =>
      $isActive ? $accentColor : theme.colors.surface.borderSubtle};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.active};
  }
`

const AddSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`

const AddButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.surface.hover};
  border: 1px dashed ${({ theme }) => theme.colors.accent.brand};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.active};
  }
`

const Picker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface.hover};
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
`

const PickerItem = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: ${fontSize.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.surface.active};
  }
`

const ResetButton = styled.div`
  margin-top: 4px;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  font-size: ${fontSize.xs};
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.surface.hover};
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 32px 16px;
  text-align: center;
`

const EmptyTitle = styled.div`
  font-size: ${fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const EmptySub = styled.div`
  font-size: ${fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`
