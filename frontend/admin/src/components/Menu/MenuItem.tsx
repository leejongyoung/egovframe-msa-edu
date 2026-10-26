import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { currentMenuStateAtom, ISideMenu } from '@stores'
import theme from '@styles/theme'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiListItemIcon-root': {
        minWidth: '36px',
      },
    },
    menuItem: {
      borderBottom: '1px solid #edf1f7',
      display: 'flex',
      overflow: 'hidden',
      width: 'auto',
      transition: 'all 300ms linear',
      position: 'relative',
      backgroundColor: 'transparent',
    },
    active: {
      color: theme.palette.primary.main,
    },
  }),
)

export interface IMenuItemProps extends ISideMenu {
  drawerOpen: boolean
}

/**
 * @TODO
 * 3단계 이상 그려지는 메뉴 처리
 */

const MenuItem: React.FC<IMenuItemProps> = props => {
  const { expanded, drawerOpen } = props
  const classes = useStyles()
  const router = useRouter()
  const { i18n } = useTranslation()

  const current = useRecoilValue(currentMenuStateAtom)

  const [open, setOpen] = useState<boolean>(expanded || false)

  const onClick = (item: ISideMenu) => {
    if (item.children.filter(i => i.isShow).length > 0) {
      setOpen(!open)
    } else {
      router.push(item.urlPath)
    }
  }

  const drawItem = useCallback(
    (item: ISideMenu) => {
      const active =
        current?.id === item.id
          ? true
          : item.children?.findIndex(ele => ele.id === current?.id) > -1
            ? true
            : false

      return (
        <div key={`list-item-div-${item.id}`} className={classes.root}>
          <ListItemButton
            key={`list-item-${item.id}`}
            onClick={() => onClick(item)}
            className={`${classes.menuItem} ${active ? classes.active : null}`}
            style={{
              paddingLeft: theme.spacing(
                item.level * (item.level === 1 ? 3 : 2),
              ),
            }}
          >
            <ListItemIcon className={active ? classes.active : null}>
              <Icon> {item.icon || 'folder'}</Icon>
            </ListItemIcon>

            {drawerOpen && (
              <ListItemText
                key={`item-text-${item.id}`}
                primary={i18n.language === 'ko' ? item.korName : item.engName}
              />
            )}

            {drawerOpen &&
              item.children.filter(i => i.isShow).length > 0 &&
              (open ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          {item.children.filter(i => i.isShow).length > 0 ? (
            <Collapse in={open && drawerOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.filter(i => i.isShow).map(i => drawItem(i))}
              </List>
            </Collapse>
          ) : null}
        </div>
      )
    },
    [props, open],
  )

  return <>{drawItem(props)}</>
}

export default MenuItem
