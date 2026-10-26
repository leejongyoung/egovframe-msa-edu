import Search from '@components/Search'
import CustomDataGrid from '@components/Table/CustomDataGrid'
import { GRID_PAGE_SIZE } from '@constants'
import usePage from '@hooks/usePage'
import useSearchTypes from '@hooks/useSearchType'
import { convertStringToDateFormat } from '@libs/date'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid'
import { ICode, ILocation, locationService, reserveItemService } from '@service'
import { conditionAtom, conditionValue, errorStateSelector } from '@stores'
import { Page, rownum } from '@utils'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { reserveService } from 'src/service/Reserve'

// material-ui style
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(1),
      },
    },
    search: {
      padding: theme.spacing(1),
      textAlign: 'center',
      width: '10vw',
      maxWidth: 100,
      minWidth: 80,
    },
  }),
)
const conditionKey = 'reserve'

type ColumnType = (
  props: ReserveListProps,
  data: Page,
  handleUpdate: (id: number) => void,
  toggleIsUse: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void,
  t: TFunction,
) => GridColDef[]

//그리드 컬럼 정의
const getColumns: ColumnType = (props, data, handleUpdate, toggleIsUse, t) => {
  const { locations, categories, status } = props
  return [
    {
      field: 'rownum',
      headerName: t('common.no'),
      headerAlign: 'center',
      align: 'center',
      width: 80,
      sortable: false,
      valueGetter: (value, row, column, apiRef) =>
        rownum(
          data,
          apiRef.current.getRowIndexRelativeToVisibleRows(row.id),
          'asc',
        ),
    },
    {
      field: 'locationId',
      headerName: t('location'),
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {
            locations.find(item => item.locationId === params.value)
              .locationName
          }
        </>
      ),
    },
    {
      field: 'categoryId',
      headerName: t('reserve_item.type'),
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>{categories.find(item => item.codeId === params.value).codeName}</>
      ),
    },
    {
      field: 'reserveItemName',
      headerName: t('reserve_item.name'),
      headerAlign: 'center',
      align: 'left',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>
          <Link href={`/reserve/${params.row.reserveId}`} variant="body2">
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'totalQty',
      headerName: `${t('reserve.count')}/${t('reserve.number_of_people')}`,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
    },
    {
      field: 'userName',
      headerName: t('reserve.user'),
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
    },
    {
      field: 'reserveStatusId',
      headerName: t('reserve.status'),
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>{status.find(item => item.codeId === params.value).codeName}</>
      ),
    },
    {
      field: 'createDate',
      headerName: t('common.created_datetime'),
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      valueFormatter: (value, row, column, apiRef) =>
        convertStringToDateFormat(value as string, 'yyyy-MM-dd HH:mm:ss'),
    },
  ]
}

interface ReserveListProps {
  locations?: ILocation[]
  categories?: ICode[]
  status?: ICode[]
}

const Reserve = (props: ReserveListProps) => {
  const { locations, categories } = props
  const classes = useStyles()
  const { t } = useTranslation()
  const router = useRouter()

  //조회조건 상태관리
  const keywordState = useRecoilValue(conditionAtom(conditionKey))
  const [customKeyword, setCustomKeyword] = useState<conditionValue | null>({
    locationId: keywordState?.locationId || '0',
    categoryId: keywordState?.categoryId || 'all',
  })
  const { page, setPageValue } = usePage(conditionKey)
  // 에러 상태관리
  const setErrorState = useSetRecoilState(errorStateSelector)

  //조회조건 select items
  const searchTypes = useSearchTypes([
    {
      key: 'item',
      label: t('reserve_item.name'),
    },
  ])

  //목록 데이터 조회 및 관리
  const { data, mutate } = reserveService.search({
    keywordType: keywordState?.keywordType || 'item',
    keyword: keywordState?.keyword || '',
    size: GRID_PAGE_SIZE,
    page,
    locationId:
      keywordState?.locationId !== '0' ? keywordState?.locationId : null,
    categoryId:
      keywordState?.categoryId !== 'all' ? keywordState?.categoryId : null,
  })

  //목록 조회
  const handleSearch = () => {
    if (page === 0) {
      mutate(data, false)
    } else {
      setPageValue(0)
    }
  }

  const handleRegister = () => {
    router.push('/reserve/item')
  }

  //datagrid page change event
  const handlePageChange = (page: number, details?: any) => {
    setPageValue(page)
  }

  const handleUpdate = (id: number) => {
    router.push(`/reserve-item/${id}`)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setCustomKeyword({
      ...customKeyword,
      categoryId: e.target.value,
    })
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setCustomKeyword({
      ...customKeyword,
      locationId: e.target.value,
    })
  }

  //사용여부 toggle 시 바로 update
  const toggleIsUse = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
      try {
        const result = await reserveItemService.updateUse(
          id,
          event.target.checked,
        )
        if (result?.status === 204) {
          mutate()
        }
      } catch (error) {
        setErrorState({ error })
      }
    },
    [customKeyword],
  )

  // 목록컬럼 재정의 > 컬럼에 비지니스 로직이 필요한 경우
  const columns = useMemo(() => {
    return getColumns(props, data, handleUpdate, toggleIsUse, t)
  }, [props, data, t])

  return (
    <div className={classes.root}>
      <Search
        keywordTypeItems={searchTypes}
        handleSearch={handleSearch}
        handleRegister={handleRegister}
        conditionKey={conditionKey}
        isNotWrapper={true}
        customKeyword={customKeyword}
        conditionNodes={
          <>
            <Box className={classes.search}>
              <TextField
                id="select-location"
                select
                value={customKeyword.locationId}
                onChange={handleLocationChange}
                variant="outlined"
                fullWidth
              >
                <MenuItem key="location-all" value="0">
                  <em>{t('common.all')}</em>
                </MenuItem>
                {locations &&
                  locations.map(option => (
                    <MenuItem key={option.locationId} value={option.locationId}>
                      {option.locationName}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
            <Box className={classes.search}>
              <TextField
                id="select-category"
                select
                value={customKeyword.categoryId}
                onChange={handleCategoryChange}
                variant="outlined"
                fullWidth
              >
                <MenuItem key="category-all" value="all">
                  <em>{t('common.all')}</em>
                </MenuItem>
                {categories &&
                  categories.map(option => (
                    <MenuItem key={option.codeId} value={option.codeId}>
                      {option.codeName}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
          </>
        }
      />

      <CustomDataGrid
        classes={classes}
        rows={data?.content}
        columns={columns}
        rowCount={data?.totalElements}
        paginationMode="server"
        getRowId={r => r.reserveId}
        paginationModel={{
          page: page,
          pageSize: GRID_PAGE_SIZE,
        }}
        onPaginationModelChange={model => handlePageChange(model.page)}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let locations: ILocation[] = []
  let categories: ICode[] = []
  let status: ICode[] = []

  try {
    let result = await locationService.getList()
    if (result) {
      locations = result.data
    }

    result = await reserveItemService.getCode('reserve-category')

    if (result) {
      categories = result.data
    }

    result = await reserveItemService.getCode('reserve-status')

    if (result) {
      status = result.data
    }
  } catch (error) {
    console.error(`reserve item query error ${error.message}`)
  }

  return {
    props: {
      categories,
      locations,
      status,
    },
  }
}

export default Reserve
