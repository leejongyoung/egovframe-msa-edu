import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React from 'react'

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    content: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    pos: {
      marginBottom: '3rem',
    },
  }),
)

const Error404 = props => {
  const classes = useStyles()
  const router = useRouter()
  return (
    <Card>
      <CardContent className={classes.content}>
        <Typography variant="h5" component="h2">
          404 Not Found
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          The page you were looking for doesn&apos;t exist
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
        >
          Back to Home
        </Button>
      </CardContent>
    </Card>
  )
}

export default Error404
