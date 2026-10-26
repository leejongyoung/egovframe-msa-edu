import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface ConfirmDialogProps extends DialogProps {
  title?: string
  contentText?: string
  handleConfirm: () => void
  handleClose: () => void
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { open, handleClose, handleConfirm, title, contentText, ...rest } =
    props

  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      {...rest}
    >
      {title && <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>}
      {contentText && (
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {contentText}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {t('label.button.close')}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleConfirm}>
          {t('label.button.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export { ConfirmDialog }
