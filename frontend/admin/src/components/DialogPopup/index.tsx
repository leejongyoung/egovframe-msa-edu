import { Typography } from '@mui/material'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions, { DialogActionsProps } from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    close: {
      position: 'absolute',
      color: theme.palette.grey[500],
      right: theme.spacing(1),
      top: theme.spacing(1),
    },
  }),
)

/**
 * 기존의 페이지를 팝업창으로 호출할 경우 사용
 */
export interface PopupProps {
  handlePopup?: (data: any) => void
}

export interface DialogPopupProps extends DialogProps {
  id: string
  children: React.ReactNode
  handleClose: () => void
  title?: string
  action?: {
    props: DialogActionsProps
    children: React.ReactNode
  }
}

const DialogPopup = (props: DialogPopupProps) => {
  const { id, children, handleClose, title, action, ...rest } = props
  const classes = useStyles()

  return (
    <Dialog
      aria-labelledby={id}
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      {...rest}
    >
      <DialogTitle id="dialog-title">
        <Typography variant="h3"> {title || 'Popup'}</Typography>
        {handleClose && (
          <IconButton
            className={classes.close}
            aria-label="close"
            onClick={handleClose}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {action && (
        <DialogActions {...action.props}>{action.children}</DialogActions>
      )}
    </Dialog>
  )
}

export default DialogPopup
