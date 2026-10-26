import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import React from 'react'
interface CustomPaginationProps {
  page: number
  totalPages: number
  first: boolean
  last: boolean
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void
}

export default function CustomPagination(props: CustomPaginationProps) {
  const { page, totalPages, first, last, onChangePage } = props

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, totalPages - 1)
  }
  const handlePageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    page: number,
  ) => {
    onChangePage(event, page)
  }

  return (
    <div className="paging">
      <nav className="MuiPagination-root">
        <div className="MuiPagination-ul">
          <IconButton
            className="MuiPaginationItem-root MuiPaginationItem-page"
            onClick={handleFirstPageButtonClick}
            disabled={first}
            aria-label="first page"
            size="large">
            <FirstPageIcon />
          </IconButton>
          <IconButton
            className="MuiPaginationItem-root MuiPaginationItem-page"
            onClick={handleBackButtonClick}
            disabled={first}
            aria-label="previous page"
            size="large">
            <KeyboardArrowLeft />
          </IconButton>
          {totalPages > 0
            ? [...Array(totalPages).keys()].map(item => (
                <Button
                  className={`MuiPaginationItem-root MuiPaginationItem-page ${
                    page === item ? 'Mui-selected' : ''
                  }`}
                  key={`pagin-item-${item}`}
                  onClick={e => {
                    handlePageButtonClick(e, item)
                  }}
                >
                  {item + 1}
                </Button>
              ))
            : null}
          <IconButton
            className="MuiPaginationItem-root MuiPaginationItem-page"
            onClick={handleNextButtonClick}
            disabled={last}
            aria-label="next page"
            size="large">
            <KeyboardArrowRight />
          </IconButton>
          <IconButton
            className="MuiPaginationItem-root MuiPaginationItem-page"
            onClick={handleLastPageButtonClick}
            disabled={last}
            aria-label="last page"
            size="large">
            <LastPageIcon />
          </IconButton>
        </div>
      </nav>
    </div>
  );
}
