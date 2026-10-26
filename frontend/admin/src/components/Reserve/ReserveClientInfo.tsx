import { ControlledTextField } from '@components/ControlledField'
import DialogPopup from '@components/DialogPopup'
import DisableTextField from '@components/DisableTextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import User from '@pages/user'
import { IReserve, IUser, ReserveFormProps } from '@service'
import { useTranslation } from 'next-i18next/pages'
import React, { useEffect, useState } from 'react'

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
    button: {
      marginLeft: theme.spacing(4),
      padding: theme.spacing(0, 1),
    },
    content: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    pos: {
      marginTop: theme.spacing(1),
      marginBottom: '3rem',
    },
  }),
)

interface ReserveClientInfoProps extends ReserveFormProps {
  data: IReserve
}

export interface IUserInfo {
  email: string
  userId: string
  userName: string
}

const ReserveClientInfo = (props: ReserveClientInfoProps) => {
  const { control, formState, data, setValue } = props
  const classes = useStyles()
  const { t } = useTranslation()

  const [expanded, setExpanded] = useState<boolean>(true)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [user, setUser] = useState<IUserInfo | null>(null)

  useEffect(() => {
    if (data) {
      setUser({
        email: data.userEmail,
        userId: data.userId,
        userName: data.userName,
      })
    }
  }, [data])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handlePopup = (userData: IUser) => {
    if (userData) {
      setUser(userData)
      setValue('userEmail', userData.email, {
        shouldValidate: true,
      })
      setValue('userId', userData.userId)
    }

    handleDialogClose()
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  return (
    <Card className={classes.root}>
      <CardActions className={classes.header}>
        <CardHeader title={`${t('reserve.user')} ${t('common.information')}`} />
        <IconButton onClick={handleExpandClick} size="large">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </CardActions>
      <Divider />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {user ? (
          <CardContent className={classes.container}>
            <DisableTextField
              label={t('label.title.name')}
              value={
                <>
                  {user.userName}
                  <Button
                    className={classes.button}
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleDialogOpen}
                  >
                    {`${t('reserve.user')} ${t('common.search')}`}
                  </Button>
                </>
              }
              labelProps={{
                size: {
                  xs: 4,
                  sm: 2,
                },
              }}
              valueProps={{
                size: {
                  xs: 8,
                  sm: 10,
                },
              }}
            />
            <ControlledTextField
              control={control}
              formState={formState}
              name="userContactNo"
              label={t('reserve.phone')}
              defaultValue={''}
              textFieldProps={{
                required: true,
              }}
            />
            <ControlledTextField
              control={control}
              formState={formState}
              name="userEmail"
              label={t('user.email')}
              defaultValue={user?.email || ''}
              textFieldProps={{
                required: true,
              }}
            />
          </CardContent>
        ) : (
          <CardContent className={classes.content}>
            <Typography
              className={classes.pos}
              variant="h5"
              color="textSecondary"
            >
              {t('reserve.msg.find_user')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDialogOpen}
            >
              {`${t('reserve.user')} ${t('common.search')}`}
            </Button>
          </CardContent>
        )}
        <DialogPopup
          id="find-dialog"
          handleClose={handleDialogClose}
          open={dialogOpen}
          title={`${t('common.user')} ${t('label.button.find')}`}
        >
          <User handlePopup={handlePopup} />
        </DialogPopup>
      </Collapse>
    </Card>
  )
}

export { ReserveClientInfo }
