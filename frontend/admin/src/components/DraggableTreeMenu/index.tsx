import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import type { DragStart, DropResult } from '@hello-pangea/dnd'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import { IMenuTree } from '@service'
import { draggableTreeExpandedAtom, draggableTreeSelectedAtom } from '@stores'
import React, { useEffect, useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import DraaggableTreeMenuItem from './DraaggableTreeMenuItem'
import { TreeJson } from './TreeJson'
import {
  convertJsonToTreeData,
  moveTreeItem,
  updateTreeItem,
} from './TreeUtils'
import type { ItemId, TreeData, TreeDestinationPosition } from './TreeUtils'

const useStyles = makeStyles((theme: Theme) => ({
  root: { marginBottom: theme.spacing(1) },
  item: {
    color: theme.palette.text.secondary,
    '&:hover': { backgroundColor: theme.palette.action.hover },
  },
  selected: { backgroundColor: '#e8f0fe', color: '#1a73e8' },
  combine: { outline: `2px solid ${theme.palette.primary.main}` },
}))

export interface DraggableTreeMenuProps {
  data: IMenuTree[]
  handleTreeDnD: (tree: IMenuTree[]) => void
}

interface VisibleItem {
  id: ItemId
  parentId: ItemId
  index: number
  depth: number
}

// The indexed hierarchy remains separate from the visible drag list: collapsing
// a branch must not remove its descendants when the branch is moved.
const visibleItems = (tree: TreeData, dragging?: string): VisibleItem[] => {
  const result: VisibleItem[] = []
  const visit = (parentId: ItemId, depth: number) => {
    tree.items[parentId].children.forEach((id, index) => {
      result.push({ id, parentId, index, depth })
      if (tree.items[id].isExpanded && String(id) !== dragging)
        visit(id, depth + 1)
    })
  }
  if (tree) visit(tree.rootId, 0)
  return result
}

function DraggableTreeMenu({ data, handleTreeDnD }: DraggableTreeMenuProps) {
  const classes = useStyles()
  const selected = useRecoilValue(draggableTreeSelectedAtom)
  const [expanded, setExpanded] = useRecoilState(draggableTreeExpandedAtom)
  const [tree, setTree] = useState<TreeData>(null)
  const [dragging, setDragging] = useState<string>()

  useEffect(() => {
    setExpanded('collapse')
  }, [])
  useEffect(() => {
    if (data) setTree(convertJsonToTreeData(data))
  }, [data])
  useEffect(() => {
    if (expanded === 'none') return
    setTree(
      current =>
        current && {
          ...current,
          items: Object.fromEntries(
            Object.entries(current.items).map(([id, item]) => [
              id,
              { ...item, isExpanded: expanded === 'expand' },
            ]),
          ),
        },
    )
  }, [expanded])

  const rows = useMemo(() => visibleItems(tree, dragging), [tree, dragging])
  const toggle = (id: ItemId, isExpanded: boolean) => {
    setExpanded('none')
    setTree(current => updateTreeItem(current, id, { isExpanded }))
  }
  const beforeDrag = ({ draggableId }: DragStart) => setDragging(draggableId)
  const onDragEnd = ({ draggableId, destination, combine }: DropResult) => {
    setDragging(undefined)
    if (!destination && !combine) return
    const source = rows.find(row => String(row.id) === draggableId)
    if (!source) return
    let target: TreeDestinationPosition
    if (combine) {
      // Combining nests the complete branch inside the target. The library
      // provides both pointer and keyboard combine interactions.
      const parent = tree.items[combine.draggableId]
      target = { parentId: parent.id, index: parent.children.length }
    } else {
      const remaining = rows.filter(row => String(row.id) !== draggableId)
      const next = remaining[destination.index]
      const previous = remaining[destination.index - 1]
      target = next
        ? { parentId: next.parentId, index: next.index }
        : previous
          ? { parentId: previous.parentId, index: previous.index + 1 }
          : { parentId: tree.rootId, index: 0 }
      if (target.parentId === source.parentId && target.index > source.index)
        target.index -= 1
    }
    // Descendants are hidden while dragging and cannot become a combine target.
    let next = moveTreeItem(tree, source, target)
    if (combine)
      next = updateTreeItem(next, target.parentId, { isExpanded: true })
    handleTreeDnD(new TreeJson(next, source, target).convert())
    setTree(next)
  }

  return (
    <div className={classes.root}>
      <DragDropContext onBeforeCapture={beforeDrag} onDragEnd={onDragEnd}>
        <Droppable droppableId="menu-tree" isCombineEnabled>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              role="tree"
              aria-label="Menu hierarchy"
            >
              {rows.map((row, index) => {
                const item = tree.items[row.id]
                const active = item.data?.menuId === selected?.menuId
                return (
                  <Draggable
                    key={String(row.id)}
                    draggableId={String(row.id)}
                    index={index}
                  >
                    {(drag, snapshot) => (
                      <div
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        {...drag.dragHandleProps}
                        role="treeitem"
                        aria-level={row.depth + 1}
                        aria-expanded={
                          item.children.length
                            ? Boolean(item.isExpanded)
                            : undefined
                        }
                        aria-selected={active}
                        className={`${classes.item} ${active ? classes.selected : ''} ${snapshot.combineTargetFor ? classes.combine : ''}`}
                        style={{
                          ...drag.draggableProps.style,
                          paddingLeft: row.depth * 40,
                        }}
                        onKeyDown={event => {
                          // Do not intercept the library's keyboard drag controls.
                          if (snapshot.isDragging) return
                          if (event.key === 'ArrowRight') {
                            event.preventDefault()
                            toggle(item.id, true)
                          }
                          if (event.key === 'ArrowLeft') {
                            event.preventDefault()
                            toggle(item.id, false)
                          }
                        }}
                      >
                        <DraaggableTreeMenuItem
                          item={item}
                          onExpand={id => toggle(id, true)}
                          onCollapse={id => toggle(id, false)}
                          selected={active}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default DraggableTreeMenu
