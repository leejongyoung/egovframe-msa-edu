import { ControlledTextField } from '@components/ControlledField'
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ReserveItemFormProps } from '@service'
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
  }),
)

const containKeys: string[] = ['managerDept', 'managerName', 'managerContact']

interface ReserveItemManagerProps extends ReserveItemFormProps {}

const ReserveItemManager = (props: ReserveItemManagerProps) => {
  const { control, formState } = props
  const classes = useStyles()
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<boolean>(true)

  const [errorText, setErrorText] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (formState.errors) {
      const keys = Object.keys(formState.errors)
      const found = keys.some(r => containKeys.includes(r))
      if (keys.length > 0 && found) {
        setErrorText('입력값이 잘못 되었습니다.')
      } else {
        setErrorText(undefined)
      }
    }
  }, [formState.errors])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <>
      <Card className={classes.root}>
        <CardActions className={classes.header}>
          <CardHeader
            title={`${t('reserve_item.manager')} ${t('common.information')}`}
            subheader={errorText && errorText}
            subheaderTypographyProps={{
              color: 'error',
            }}
          />
          <IconButton onClick={handleExpandClick} size="large">
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Divider />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.container}>
            <ControlledTextField
              control={control}
              formState={formState}
              name="managerDept"
              label={`${t('reserve_item.manager')} ${t('reserve_item.dept')}`}
              defaultValue={''}
              contollerProps={{
                rules: {
                  maxLength: 200,
                },
              }}
              textFieldProps={{
                required: false,
              }}
            />
            <ControlledTextField
              control={control}
              formState={formState}
              name="managerName"
              label={`${t('reserve_item.manager')} ${t('label.title.name')}`}
              defaultValue={''}
              contollerProps={{
                rules: {
                  maxLength: 200,
                },
              }}
              textFieldProps={{
                required: false,
              }}
            />
            <ControlledTextField
              control={control}
              formState={formState}
              name="managerContact"
              label={`${t('reserve_item.manager')} ${t('common.contact')}`}
              defaultValue={''}
              contollerProps={{
                rules: {
                  maxLength: 50,
                },
              }}
              textFieldProps={{
                required: false,
              }}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  )
}

export { ReserveItemManager }
