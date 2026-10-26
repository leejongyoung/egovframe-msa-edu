import React from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Breakpoint } from '@mui/material/styles'

const BREAKPOINT_KEYS: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']

type HiddenProps = {
  children?: React.ReactNode
} & Partial<Record<`${Breakpoint}Up` | `${Breakpoint}Down`, boolean>>

/**
 * Material-UI v4 의 Hidden(js 구현) 대체 컴포넌트.
 * xxUp: 해당 breakpoint 이상에서 숨김, xxDown: 해당 breakpoint 미만에서 숨김
 * (theme.breakpoints.up / down 과 같은 의미)
 */
const Hidden = (props: HiddenProps) => {
  const { children } = props
  const theme = useTheme()

  const queries = BREAKPOINT_KEYS.flatMap(key => [
    props[`${key}Up`] ? theme.breakpoints.up(key) : null,
    props[`${key}Down`] ? theme.breakpoints.down(key) : null,
  ])
    .filter(Boolean)
    .map(query => String(query).replace(/^@media\s*/, ''))
    .join(', ')

  const hidden = useMediaQuery(queries || 'not all')

  return hidden ? null : <>{children}</>
}

export default Hidden
