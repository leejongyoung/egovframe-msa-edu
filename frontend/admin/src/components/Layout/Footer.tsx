import React from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import Copyright from '@components/Copyright'

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    backgroundColor: theme.palette.background.default,
  },
}))
const Footer: React.FC = () => {
  const classes = useStyles()

  return (
    <Container component="footer" className={classes.footer}>
      <Typography variant="body1">Footer</Typography>
      <Copyright />
    </Container>
  )
}

export default Footer
