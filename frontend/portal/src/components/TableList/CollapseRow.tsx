import React from 'react'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { GridRowModel, GridRowId } from '@mui/x-data-grid'
import { CollapseColDef } from './CollapsibleTable'

interface CollapseRowProps {
  columns: CollapseColDef[]
  row: GridRowModel
  collapseColumn: React.ReactNode
  collapseClassName?: string
  rowId?: GridRowId
}

const renderCell = (
  column: CollapseColDef,
  row: GridRowModel,
  rowId: GridRowId,
  rowIdx: number,
  toggleOpen: () => void,
) => {
  const value = row[column.field]
  let cell: React.ReactNode = value

  if (column.renderCell) {
    cell = column.renderCell({ id: row[rowId], field: column.field, value, row })
  } else if (column.valueFormatter) {
    cell = column.valueFormatter(value)
  }

  return (
    <TableCell
      key={`collapse-cell-${column.field}-${rowIdx}`}
      align={column.align}
      width={column.width}
      className={String(column.cellClassName) || ''}
      onClick={toggleOpen}
    >
      {cell}
    </TableCell>
  )
}

const CollapseRow = (props: CollapseRowProps) => {
  const {
    columns,
    row,
    collapseColumn,
    collapseClassName = 'content',
    rowId = 'id',
  } = props
  const [open, setOpen] = React.useState(false)

  const toggleOpen = () => {
    setOpen(!open)
  }

  return (
    <>
      <TableRow style={{ height: 70 }}>
        {columns.map((col, index) => {
          return renderCell(col, row, rowId, index, toggleOpen)
        })}

        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ padding: 0, width: '50px' }}
          colSpan={columns.length + 1}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={collapseClassName}>{collapseColumn}</div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default CollapseRow
