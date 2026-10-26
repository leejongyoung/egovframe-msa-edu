import { GridButtons } from '@components/Buttons'
import { PopupProps } from '@components/DialogPopup'
import Search, { IKeywordType } from '@components/Search'
import CustomDataGrid from '@components/Table/CustomDataGrid'
import { GRID_PAGE_SIZE } from '@constants'
import usePage from '@hooks/usePage'
// 내부 컴포넌트 및 custom hook, etc...
import { convertStringToDateFormat } from '@libs/date'
import Button from '@mui/material/Button'
// material-ui deps
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid'
// api
import { userService } from '@service'
import {
  conditionAtom,
  detailButtonsSnackAtom,
  errorStateSelector,
} from '@stores'
import { Page, rownum } from '@utils'
import { AxiosError } from 'axios'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next/pages'
import { TFunction } from 'i18next'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
// 상태관리 recoil
import { useRecoilValue, useSetRecoilState } from 'recoil'

// material-ui style
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(1),
      },
    },
  }),
)

// 그리드 컬럼 정의
type ColumnsType = (
  data: Page,
  deleteUser: (userId: string) => void,
  updateUser: (userId: string) => void,
  t?: TFunction,
  handlePopup?: (data: any) => void,
) => GridColDef[]

const getColumns: ColumnsType = (
  data,
  deleteUser,
  updateUser,
  t,
  handlePopup,
) => [
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
    field: 'email',
    headerName: t('user.email'),
    headerAlign: 'center',
    align: 'left',
    flex: 1,
    sortable: false,
  },
  {
    field: 'userName',
    headerName: t('user.user_name'),
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    sortable: false,
  },
  {
    field: 'roleName',
    headerName: t('role.role_name'),
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    sortable: false,
  },
  {
    field: 'loginFailCount',
    headerName: t('user.login_lock_at'),
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    sortable: false,
    renderCell: function renderCellLoginFailCount(
      params: GridRenderCellParams,
    ) {
      return params.row.loginFailCount >= 5 ? '잠김' : '해당없음'
    },
  },
  {
    field: 'userStateCodeName',
    headerName: t('user.user_state_code'),
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    sortable: false,
  },
  {
    field: 'lastLoginDate',
    headerName: t('user.last_login_date'),
    headerAlign: 'center',
    align: 'center',
    width: 200,
    sortable: false,
    valueFormatter: (value, row, column, apiRef) =>
      value === null
        ? ''
        : convertStringToDateFormat(value as string, 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    field: 'buttons',
    headerName: t('common.manage'),
    headerAlign: 'center',
    align: 'center',
    width: 150,
    sortable: false,
    renderCell: function renderCellButtons(params: GridRenderCellParams) {
      return handlePopup ? (
        <Button
          onClick={() => {
            handlePopup(params.row)
          }}
          variant="outlined"
          color="inherit"
          size="small"
        >
          {t('common.select')}
        </Button>
      ) : (
        <GridButtons
          id={params.row.userId as string}
          handleDelete={deleteUser}
          handleUpdate={updateUser}
        />
      )
    },
  },
]

const conditionKey = 'user'

export type UserProps = PopupProps

// 실제 render되는 컴포넌트
const User: NextPage<UserProps> = props => {
  // props 및 전역변수
  const { handlePopup } = props
  const classes = useStyles()
  const route = useRouter()
  const { t } = useTranslation()

  // 버튼 component 상태 전이
  const setSuccessSnackBar = useSetRecoilState(detailButtonsSnackAtom)

  // 조회조건 select items
  const searchTypes: IKeywordType[] = [
    {
      key: 'userName',
      label: t('user.user_name'),
    },
    {
      key: 'email',
      label: t('user.email'),
    },
  ]

  /**
   * 상태관리 필요한 훅
   */
  // 조회조건 상태관리
  const keywordState = useRecoilValue(conditionAtom(conditionKey))
  const setErrorState = useSetRecoilState(errorStateSelector)

  // 현 페이지내 필요한 hook
  const { page, setPageValue } = usePage(conditionKey)

  // 목록 데이터 조회 및 관리
  const { data, mutate } = userService.search({
    keywordType: keywordState?.keywordType || 'userName',
    keyword: keywordState?.keyword || '',
    size: GRID_PAGE_SIZE,
    page,
  })

  /**
   * 비지니스 로직
   */

  // 에러 callback
  const errorCallback = useCallback(
    (error: AxiosError) => {
      setSuccessSnackBar('none')

      setErrorState({
        error,
      })
    },
    [setErrorState, setSuccessSnackBar],
  )

  // 성공 callback
  const successCallback = useCallback(() => {
    setSuccessSnackBar('success')

    mutate()
  }, [mutate, setSuccessSnackBar])

  // 삭제
  const deleteUser = useCallback(
    (userId: string) => {
      setSuccessSnackBar('loading')

      userService.delete({
        userId,
        callback: successCallback,
        errorCallback,
      })
    },
    [errorCallback, mutate, setSuccessSnackBar],
  )

  // 수정 시 상세 화면 이동
  const updateUser = useCallback(
    (userId: string) => {
      route.push(`/user/${userId}`)
    },
    [route],
  )

  // 목록컬럼 재정의 > 컬럼에 비지니스 로직이 필요한 경우
  const columns = useMemo(
    () => getColumns(data, deleteUser, updateUser, t, handlePopup),
    [data, deleteUser, updateUser, t, handlePopup],
  )

  // 목록 조회
  const handleSearch = () => {
    if (page === 0) {
      mutate()
    } else {
      setPageValue(0)
    }
  }

  // datagrid page change event
  const handlePageChange = (_page: number, details?: any) => {
    setPageValue(_page)
  }

  return (
    <div className={classes.root}>
      <Search
        keywordTypeItems={searchTypes}
        handleSearch={handleSearch}
        handleRegister={
          handlePopup
            ? null
            : () => {
                route.push('user/-1')
              }
        }
        conditionKey={conditionKey}
      />
      <CustomDataGrid
        classes={classes}
        rows={data?.content}
        columns={columns}
        rowCount={data?.totalElements}
        paginationMode="server"
        getRowId={r => r.userId}
        paginationModel={{
          page: page,
          pageSize: GRID_PAGE_SIZE,
        }}
        onPaginationModelChange={model => handlePageChange(model.page)}
      />
    </div>
  )
}

export default User
