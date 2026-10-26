import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Breakpoint } from '@mui/material/styles'

/**
 * Material-UI v4 의 withWidth HOC 대체 hook.
 * 현재 viewport 가 해당하는 가장 큰 breakpoint key 를 반환한다. (xs ~ xl)
 */
const useWidth = (): Breakpoint => {
  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()

  return (
    keys.reduce<Breakpoint | null>((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks -- keys 개수는 theme 에 의해 고정된다.
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || 'xs'
  )
}

export default useWidth
