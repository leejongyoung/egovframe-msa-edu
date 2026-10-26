import {
  GRID_PAGE_SIZE,
  GRID_ROWS_PER_PAGE_OPTION,
  GRID_ROW_HEIGHT,
} from '@constants'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import * as React from 'react'
import DataGridPagination from './DataGridPagination'

export interface IDataGridProps extends DataGridProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .hover': {
        cursor: 'pointer',
        color: '#1a3e72',
      },
    },
  }),
)

export default function CustomDataGrid(props: IDataGridProps) {
  const {
    columns,
    rows,
    paginationModel,
    pageSizeOptions,
    rowHeight,
    getRowId,
  } = props
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <DataGrid
        {...props}
        rows={rows || []}
        columns={columns}
        rowHeight={rowHeight || GRID_ROW_HEIGHT}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: GRID_PAGE_SIZE },
          },
        }}
        paginationModel={paginationModel}
        pageSizeOptions={pageSizeOptions || GRID_ROWS_PER_PAGE_OPTION}
        autoHeight
        pagination
        slots={{ pagination: DataGridPagination }}
        getRowId={getRowId || (r => r.id)}
      />
    </div>
  )
}
