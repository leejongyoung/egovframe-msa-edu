import Grid, { GridProps } from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      padding: theme.spacing(1),
      textAlign: 'center',
      backgroundColor: theme.palette.background.default,
    },
    text: {
      padding: theme.spacing(1),
      textAlign: 'left',
    },
  }),
)

interface DisableTextFieldProps {
  label: string
  value: string | number | React.ReactNode
  labelProps?: GridProps
  valueProps?: GridProps
}

const DisableTextField = ({
  label,
  value,
  labelProps,
  valueProps,
}: DisableTextFieldProps) => {
  const classes = useStyles()
  return (
    <Grid container spacing={1}>
      <Grid size={4} {...labelProps}>
        <Paper className={classes.label}>
          <Typography variant="body1">{label}</Typography>
        </Paper>
      </Grid>
      <Grid size={8} {...valueProps}>
        <Paper className={classes.text}>
          {typeof value === 'string' || typeof value === 'number' ? (
            <Typography variant="body1">{value}</Typography>
          ) : (
            value
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default DisableTextField
