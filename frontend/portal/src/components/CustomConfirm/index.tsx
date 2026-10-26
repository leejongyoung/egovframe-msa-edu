import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Button, { ButtonProps } from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { AlertColor } from '@mui/material/Alert'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { Typography } from '@mui/material'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      position: 'relative',
      top: '0.11em',
      width: theme.typography.h5.fontSize,
      height: theme.typography.h5.fontSize,
    },
  }),
)

export interface CustomConfirmPrpps extends DialogProps {
  title?: string
  severity?: AlertColor
  contentText?: string | string[]
  handleConfirm: () => void
  handleCancel: () => void
  buttonText?: string
  buttonProps?: ButtonProps
}

const CustomConfirm = (props: CustomConfirmPrpps) => {
  const {
    open,
    handleConfirm,
    handleCancel,
    title,
    severity,
    contentText,
    buttonText,
    buttonProps,
    ...rest
  } = props

  const classes = useStyles()

  const { t } = useTranslation()

  const icon = useCallback(() => {
    return severity === 'error' ? (
      <ErrorOutlineOutlinedIcon color="error" className={classes.icon} />
    ) : severity === 'success' ? (
      <CheckCircleOutlineOutlinedIcon className={classes.icon} />
    ) : severity === 'warning' ? (
      <ReportProblemOutlinedIcon className={classes.icon} />
    ) : (
      <InfoOutlinedIcon className={classes.icon} />
    )
  }, [severity])

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...rest}
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h5">
          {icon()} {title || t('common.noti')}
        </Typography>
      </DialogTitle>
      {contentText && (
        <DialogContent>
          {Array.isArray(contentText) ? (
            contentText.map((value, index) => (
              <DialogContentText
                key={`dialog-${index}`}
                id={`alert-dialog-description-${index}`}
              >
                - {value}
              </DialogContentText>
            ))
          ) : (
            <DialogContentText id="alert-dialog-description">
              {contentText}
            </DialogContentText>
          )}
        </DialogContent>
      )}
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleConfirm}
          color="primary"
          autoFocus
          {...buttonProps}
        >
          {buttonText || t('label.button.confirm')}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          color="primary"
          autoFocus
          {...buttonProps}
        >
          {buttonText || t('label.button.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomConfirm
