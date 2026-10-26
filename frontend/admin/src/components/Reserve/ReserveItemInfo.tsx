import DisableTextField from '@components/DisableTextField'
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
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ICode, IReserveItemRelation } from '@service'
import { useTranslation } from 'next-i18next/pages'
import React, { useState } from 'react'

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
  }),
)

interface ReserveItemInfoProps {
  data: IReserveItemRelation
  handleSearchItem: () => void
  reserveStatus?: ICode
}

const ReserveItemInfo = (props: ReserveItemInfoProps) => {
  const { data, handleSearchItem, reserveStatus } = props
  const classes = useStyles()
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<boolean>(true)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card className={classes.root}>
      <CardActions className={classes.header}>
        <CardHeader title={`${t('reserve_item')} ${t('common.information')}`} />
        <IconButton onClick={handleExpandClick} size="large">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </CardActions>
      <Divider />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={classes.container}>
          <Grid container spacing={1}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <DisableTextField
                label={t('location')}
                value={data.location.locationName}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <DisableTextField
                label={t('reserve_item.type')}
                value={data.categoryName}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12,
              }}
            >
              <DisableTextField
                label={t('reserve_item.name')}
                value={
                  <>
                    {data.reserveItemName}
                    {reserveStatus ? null : (
                      <Button
                        className={classes.button}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleSearchItem}
                      >
                        {`${t('reserve_item')} ${t('label.button.change')}`}
                      </Button>
                    )}
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
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <DisableTextField
                label={
                  data.categoryId === 'education'
                    ? t('reserve.number_of_people')
                    : t('reserve.count')
                }
                value={data.totalQty}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <DisableTextField
                label={t('reserve_item.selection_means')}
                value={data.selectionMeansName}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <DisableTextField
                label={`${t('reserve_item.operation')} ${t('reserve.period')}`}
                value={`${convertStringToDateFormat(
                  data.operationStartDate,
                )} ~ ${convertStringToDateFormat(data.operationEndDate)}`}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <DisableTextField
                label={`${t('reserve_item.request')} ${t('reserve.period')}`}
                value={
                  <Typography variant="body1" noWrap>
                    {`${convertStringToDateFormat(
                      data.requestStartDate,
                      'yyyy-MM-dd HH:mm',
                    )}
                    ~ ${convertStringToDateFormat(
                      data.requestEndDate,
                      'yyyy-MM-dd HH:mm',
                    )}
                    `}
                  </Typography>
                }
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12,
              }}
            >
              <DisableTextField
                label={`${t('common.free')} ${t('common.paid')}`}
                value={data.isPaid ? t('common.paid') : t('common.free')}
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
            </Grid>

            {reserveStatus && (
              <Grid size={12}>
                <DisableTextField
                  label={t('reserve.status')}
                  value={
                    reserveStatus.codeId === 'request' ? (
                      <Typography variant="body1" color="error">
                        {reserveStatus.codeName}
                      </Typography>
                    ) : (
                      reserveStatus.codeName
                    )
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
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export { ReserveItemInfo }
