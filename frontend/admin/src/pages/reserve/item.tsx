import DialogPopup from '@components/DialogPopup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import ReserveItem from '@pages/reserve-item'
import { IReserveItem } from '@service'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(5),
      backgroundColor: theme.palette.background.default,
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
interface SearchItemProps {}

const SearchItem = (props: SearchItemProps) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const router = useRouter()

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const handlePopup = (data: IReserveItem) => {
    if (data) {
      router.push(`/reserve/-1?reserveItemId=${data.reserveItemId}`)
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
      <CardContent className={classes.content}>
        <Typography className={classes.pos} variant="h5" color="textSecondary">
          {t('reserve.msg.find_item')}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          {`${t('reserve_item')} ${t('common.search')}`}
        </Button>
        <DialogPopup
          id="find-dialog"
          handleClose={handleDialogClose}
          open={dialogOpen}
          title={`${t('reserve_item')} ${t('label.button.find')}`}
        >
          <ReserveItem handlePopup={handlePopup} />
        </DialogPopup>
      </CardContent>
    </Card>
  )
}

export default SearchItem
