import { ASSET_PATH } from '@constants/env'
import Head from 'next/head'
import React from 'react'

export interface IGlobalStyleProps {
  children: React.ReactNode
}

const GlobalStyles = ({ children }: IGlobalStyleProps) => (
  <>
    <Head><link rel="stylesheet" href={`${ASSET_PATH}/layout.css`} /></Head>
    {children}
  </>
)

export default GlobalStyles
