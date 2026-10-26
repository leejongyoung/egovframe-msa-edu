import { Typography } from '@mui/material'
import Button, { ButtonProps } from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { AlertColor } from '@mui/material/Alert'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

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

export interface CustomAlertPrpps extends DialogProps {
  title?: string
  severity?: AlertColor
  contentText?: string | string[]
  handleAlert: () => void
  buttonText?: string
  buttonProps?: ButtonProps
}

const CustomAlert = (props: CustomAlertPrpps) => {
  const {
    open,
    handleAlert,
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
          onClick={handleAlert}
          color="primary"
          autoFocus
          {...buttonProps}
        >
          {buttonText || t('label.button.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomAlert
