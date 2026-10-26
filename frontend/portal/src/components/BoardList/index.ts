import { CollapseColDef } from '@components/TableList'
import { GridColDef } from '@mui/x-data-grid'
import { Page } from '@service'
import { TFunction } from 'next-i18next/pages'

export * from './NormalBoardList'
export * from './FAQBoardList'
export * from './QnABoardList'

export type ColumnsType = (
  data: Page,
  t?: TFunction,
) => GridColDef[]

export type CollapseColumnsType = (
  data: Page,
  t?: TFunction,
) => CollapseColDef[]
