import React from 'react'
import Pagination, { PaginationProps } from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid'

const DataGridPagination = (props: PaginationProps) => {
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageCount = useGridSelector(apiRef, gridPageCountSelector)

  return (
    <div className="paging">
      <Pagination
        color="primary"
        page={page + 1}
        count={pageCount}
        showFirstButton
        showLastButton
        renderItem={item => <PaginationItem {...item} />}
        onChange={(_, value) => apiRef.current.setPage(value - 1)}
        {...props}
      />
    </div>
  )
}

export default DataGridPagination
