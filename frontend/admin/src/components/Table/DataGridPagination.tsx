import React from 'react'
import {
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
} from '@mui/x-data-grid'
import Pagination, { PaginationProps } from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'

export default function DataGridPagination(props: PaginationProps) {
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageCount = useGridSelector(apiRef, gridPageCountSelector)

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      showFirstButton={true}
      showLastButton={true}
      renderItem={item => <PaginationItem {...item} />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
      {...props}
    />
  )
}
