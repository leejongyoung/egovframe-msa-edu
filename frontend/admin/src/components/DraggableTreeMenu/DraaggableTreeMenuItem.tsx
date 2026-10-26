import React, { createRef, useEffect, useState } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import type { ItemId, TreeItem } from './TreeUtils'
import IconButton from '@mui/material/IconButton'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import { useRecoilState } from 'recoil'
import { treeChangeNameAtom, draggableTreeSelectedAtom } from '@stores'
import TextField from '@mui/material/TextField'
import { ClassNameMap } from '@mui/styles'

export const useTreeItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelRoot: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 0),
    },
    label: {
      display: 'flex',
      color: theme.palette.text.secondary,
    },
    selected: {
      color: '#1a73e8',
    },
    labelIcon: {
      marginRight: theme.spacing(1),
    },
    labelText: {
      fontWeight: 'inherit',
      flexGrow: 1,
      textAlign: 'initial',
    },
    bull: {
      width: '1em',
      height: '1em',
      fontSize: '1.5rem',
      marginRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
  }),
)

const getIcon = (
  item: TreeItem,
  onExpand: (itemId: ItemId) => void,
  onCollapse: (itemId: ItemId) => void,
  classes: ClassNameMap,
) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
      <IconButton
        size="small"
        onClick={() => onCollapse(item.id)}
        aria-label="collapse"
      >
        <ArrowDropDownIcon />
      </IconButton>
    ) : (
      <IconButton
        size="small"
        onClick={() => onExpand(item.id)}
        aria-label="expand"
      >
        <ArrowRightIcon />
      </IconButton>
    )
  }

  return (
    <IconButton className={classes.bull} size="small">
      &bull;
    </IconButton>
  )
}

const setLabel = (
  item: TreeItem,
  classes: ClassNameMap,
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void,
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  handleBlur: () => void,
  changed?: boolean,
  selected?: boolean,
  inputRef?: React.RefObject<HTMLInputElement>,
) => {
  if (changed) {
    return (
      <TextField
        size="small"
        id="tree-name"
        inputRef={inputRef}
        margin="dense"
        defaultValue={item.data?.name}
        onKeyPress={handleKeyPress}
        onBlur={handleBlur}
        autoFocus
      />
    )
  }

  return (
    <div
      onClick={handleClick}
      className={`${classes.label} ${selected ? classes.selected : ''}`}
    >
      <Icon fontSize="small" className={classes.labelIcon}>
        {item.data?.icon || 'folder'}
      </Icon>
      <Typography variant="body2" className={classes.labelText}>
        {item.data ? item.data.name : ''}
      </Typography>
    </div>
  )
}

export interface DraaggableTreeMenuItemProps {
  item: TreeItem
  onExpand: (itemId: ItemId) => void
  onCollapse: (itemId: ItemId) => void
  selected?: boolean
}

const DraaggableTreeMenuItem = (props: DraaggableTreeMenuItemProps) => {
  const classes = useTreeItemStyles()
  const { item, onExpand, onCollapse, selected } = props

  const [treeSelected, setTreeSelected] = useRecoilState(
    draggableTreeSelectedAtom,
  )
  const [treeChangeName, setTreeChangeName] = useRecoilState(treeChangeNameAtom)
  const [changed, setChanged] = useState<boolean>(false)
  const nameRef = createRef<HTMLInputElement>()

  useEffect(() => {
    if (
      treeChangeName.state === 'change' &&
      item.data?.menuId === treeSelected?.menuId
    ) {
      setChanged(true)
      return
    }

    setChanged(false)
  }, [treeSelected, item, treeChangeName])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setTreeSelected(item.data)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      setTreeChangeName({
        state: 'complete',
        id: item.data?.menuId,
        name: nameRef.current?.value,
      })
    }
  }

  const handleBlur = () => {
    setTreeChangeName({
      state: 'none',
      id: null,
      name: null,
    })
  }

  return (
    <div className={`${classes.labelRoot}`}>
      {getIcon(item, onExpand, onCollapse, classes)}
      {setLabel(
        item,
        classes,
        handleClick,
        handleKeyPress,
        handleBlur,
        changed,
        selected,
        nameRef,
      )}
    </div>
  )
}

export default DraaggableTreeMenuItem
