import React from 'react'
import { Typography } from '@mui/material'
import Link from '@mui/material/Link'
import { getCurrentDate } from '@libs/date'

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {getCurrentDate().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default Copyright
