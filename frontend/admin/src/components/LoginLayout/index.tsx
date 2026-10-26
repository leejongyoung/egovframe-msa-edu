import Box from '@mui/material/Box'
import React from 'react'

type Props = React.PropsWithChildren

const LoginLayout: React.FC<Props> = ({ children }) => {
  return <Box>{children}</Box>
}

export default LoginLayout
