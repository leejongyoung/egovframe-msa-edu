import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(10),
  },
}))

const Loader: React.FC = () => {
  const classes = useStyles()
  return (
    <Container className={classes.container}>
      <CircularProgress size={40} />
    </Container>
  )
}

export default Loader
