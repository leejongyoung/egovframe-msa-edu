import React from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Link from '@mui/material/Link'

import { DRAWER_WIDTH } from '@constants'
import { Menu } from '@components/Menu'
import { Typography } from '@mui/material'

const useStyles = makeStyles<Theme>((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: `calc(${theme.spacing(7)} + 1px)`,
      [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
      },
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    logo: {
      // position: 'relative',
      padding: theme.spacing(0, 1),
      zIndex: 4,
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: '0',

        height: '1px',
        right: '15px',
        width: 'calc(100% - 30px)',
      },
    },
    logoLink: {
      marginLeft: '5px',
      padding: '5px 0',
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'left',
      lineHeight: '30px',
      textDecoration: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      color: theme.palette.common.white,
    },
    img: {
      width: '24px',
      height: '24px',
      verticalAlign: 'middle',
      border: '0',
      marginTop: theme.spacing(1),
    },
  }),
)

interface ISideBarProps {
  open: boolean
  onClick: () => void
  logo?: string
  logoText?: string
}

const SideBar = (props: ISideBarProps) => {
  const { open, onClick, logo, logoText } = props
  const classes = useStyles()
  const router = useRouter()

  const onLogoClick = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push('/')
  }

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.drawerHeader}>
        {logo && (
          <div className={classes.logo}>
            <Link href="/" onClick={onLogoClick} className={classes.logoLink}>
              <img alt="Logo" src={logo} className={classes.img} />
              <Typography className={classes.logoLink} variant="h4">
                {logoText}
              </Typography>
            </Link>
          </div>
        )}
        <IconButton onClick={onClick} size="large">
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <Divider />
      <Menu open={open} />
    </Drawer>
  )
}

export default SideBar
