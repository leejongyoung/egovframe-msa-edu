import AttachList from '@components/AttachList'
import { CustomButtons, IButtonProps } from '@components/Buttons'
import DialogPopup from '@components/DialogPopup'
import DisableTextField from '@components/DisableTextField'
import ValidationAlert from '@components/EditForm/ValidationAlert'
import { convertStringToDateFormat } from '@libs/date'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { IAttachmentResponse, IReserve } from '@service'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(2),
      '& .MuiInputLabel-outlined': {
        zIndex: 0,
      },
    },
    header: {
      justifyContent: 'space-between',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    attach: {
      borderRadius: theme.spacing(0.5),
      marginTop: theme.spacing(1),
    },
    label: {
      padding: theme.spacing(1),
      textAlign: 'center',
      backgroundColor: theme.palette.background.default,
    },
  }),
)

interface ReserveInfoViewProps {
  data: IReserve
  attachData?: IAttachmentResponse[]
  handleList: () => void
  handleButtons: (status: string, reason?: string) => void
}

const ReserveInfoView = ({
  data,
  attachData,
  handleList,
  handleButtons,
}: ReserveInfoViewProps) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [reason, setReason] = useState<string>('')
  const [reasonError, setReasonError] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(true)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    if (reason.length > 0) {
      setReasonError(false)
    }
  }, [reason])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleCancel = () => {
    if (reason.length <= 0) {
      setReasonError(true)
      return
    }

    handleButtons('cancel', reason)
  }

  const buttons = useCallback(() => {
    let bs: IButtonProps[] = []
    if (
      data?.reserveStatusId === 'request' ||
      data?.reserveStatusId === 'cancel'
    ) {
      bs.push({
        label: `${t('reserve')} ${t('common.approve')}`,
        confirmMessage: `${t('reserve')} ${t('common.approve')}${t(
          'common.msg.would.format',
        )}`,
        handleButton: () => {
          handleButtons('approve')
        },
        completeMessage: `${t('reserve')} ${t('common.approve')}${t(
          'common.msg.done.format',
        )}`,
        variant: 'contained',
        color: 'primary',
      })
    }

    if (
      data?.reserveStatusId === 'request' ||
      data?.reserveStatusId === 'approve'
    ) {
      bs.push({
        label: `${t('reserve')} ${t('common.cancel')}`,
        confirmMessage: `${t('reserve')} ${t('common.cancel')}${t(
          'common.msg.would.format',
        )}`,
        handleButton: handleDialogOpen,
        completeMessage: `${t('reserve')} ${t('common.cancel')}${t(
          'common.msg.done.format',
        )}`,
        variant: 'contained',
        color: 'secondary',
      })
    }

    bs.push({
      label: t('label.button.list'),
      handleButton: handleList,
      variant: 'contained',
    })

    return bs
  }, [data])

  return (
    <>
      <Card className={classes.root}>
        <CardActions className={classes.header}>
          <CardHeader title={`${t('reserve')} ${t('common.information')}`} />
          <IconButton onClick={handleExpandClick} size="large">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </CardActions>
        <Divider />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.container}>
            <Grid container spacing={1}>
              {data.reserveItem.categoryId === 'education' ? null : (
                <Grid size={12}>
                  <DisableTextField
                    label={`${t('reserve.request')} ${t('common.period')}`}
                    value={`${convertStringToDateFormat(
                      data.reserveStartDate,
                    )}~${convertStringToDateFormat(data.reserveEndDate)}`}
                  />
                </Grid>
              )}
              {data.reserveItem.categoryId === 'space' ? null : (
                <Grid size={12}>
                  <DisableTextField
                    label={
                      data.reserveItem.categoryId === 'education'
                        ? `${t('reserve.request')} ${t(
                            'reserve.number_of_people',
                          )}`
                        : `${t('reserve.request')} ${t('reserve.count')}`
                    }
                    value={data.reserveQty}
                  />
                </Grid>
              )}
              <Grid size={12}>
                <DisableTextField
                  label={`${t('reserve.request')} ${t('reserve.purpose')}`}
                  value={data.reservePurposeContent}
                />
              </Grid>
              <Grid size={12}>
                <Paper className={classes.label}>
                  <Typography variant="body1">
                    {t('common.attachment')}
                  </Typography>
                </Paper>
                <AttachList data={attachData} readonly={true} />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
      <CustomButtons buttons={buttons()} />
      <DialogPopup
        id="find-dialog"
        handleClose={handleDialogClose}
        open={dialogOpen}
        title={`${t('reserve')} ${t('common.cancel')}`}
        action={{
          props: {},
          children: (
            <>
              <Button
                onClick={handleCancel}
                variant="contained"
                color="secondary"
              >
                {`${t('reserve')} ${t('common.cancel')}`}
              </Button>
              <Button onClick={handleDialogClose} variant="contained">
                {t('label.button.close')}
              </Button>
            </>
          ),
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label={t('reserve.cancel_reason')}
          type="text"
          fullWidth
          error={reasonError}
          value={reason}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setReason(e.target.value)
          }}
        />
        {reasonError && (
          <ValidationAlert message={t('reserve.msg.calcel_reason')} />
        )}
      </DialogPopup>
    </>
  )
}

export { ReserveInfoView }
