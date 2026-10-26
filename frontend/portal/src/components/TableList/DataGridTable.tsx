import React from 'react'
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid'
import { DEFUALT_GRID_PAGE_SIZE } from '@constants'
import useWidth from '@hooks/useWidth'
import DataGridPagination from './DataGridPagination'

interface DataGridTableProps extends DataGridProps {
  xsColumns: GridColDef[]
}

const DataGridTable = (props: DataGridTableProps) => {
  const { columns, rows, xsColumns, getRowId, ...rest } = props
  const width = useWidth()

  return (
    <div className="list">
      <DataGrid
        rows={rows || []}
        columns={width === 'xs' ? xsColumns : columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: DEFUALT_GRID_PAGE_SIZE } } }}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        disableDensitySelector
        columnHeaderHeight={width === 'xs' ? 0 : 70}
        rowHeight={width === 'xs' ? 80 : 70}
        autoHeight
        pagination
        slots={{ pagination: DataGridPagination }}
        getRowId={getRowId || (r => r.id)}
        {...rest}
      />
    </div>
  )
}

export default DataGridTable
