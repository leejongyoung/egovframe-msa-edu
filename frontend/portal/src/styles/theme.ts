import { createTheme } from '@mui/material/styles'


const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 1024,
      lg: 1280,
      xl: 1920,
    },
  },
})

export default theme
