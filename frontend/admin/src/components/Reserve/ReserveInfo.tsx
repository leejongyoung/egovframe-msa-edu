import AttachList from '@components/AttachList'
import { Upload, UploadType } from '@components/Upload'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  IAttachmentResponse,
  IReserve,
  IReserveItemRelation,
  ReserveFormProps,
} from '@service'
import { errorStateSelector } from '@stores'
import React, { useEffect, useState } from 'react'
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import { ReserveEduInfo } from './ReserveEduInfo'
import { ReserveEquipInfo } from './ReserveEquipInfo'
import { ReserveSpaceInfo } from './ReserveSpaceInfo'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(2),
      '& .MuiInputLabel-outlined': {
        zIndex: 0,
      },
    },
    header: {
      justifyContent: 'space-between',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    attach: {
      borderRadius: theme.spacing(0.5),
      marginTop: theme.spacing(1),
    },
  }),
)

interface ReserveInfoProps extends ReserveFormProps {
  data?: IReserve
  item: IReserveItemRelation
  setError: UseFormSetError<IReserve>
  clearErrors: UseFormClearErrors<IReserve>
  fileProps: {
    uploadRef: React.MutableRefObject<UploadType>
    attachData: IAttachmentResponse[] | undefined
    setAttachData: React.Dispatch<React.SetStateAction<IAttachmentResponse[]>>
  }
}

const containKeys: string[] = [
  'reserveItemId',
  'reserveQty',
  'reservePurposeContent',
  'attachmentCode',
  'reserveStartDate',
  'reserveEndDate',
]

const ReserveInfo = (props: ReserveInfoProps) => {
  const {
    control,
    formState,
    register,
    getValues,
    data,
    item,
    setError,
    clearErrors,
    fileProps,
  } = props
  const classes = useStyles()
  const { t } = useTranslation()

  const [expanded, setExpanded] = useState<boolean>(true)
  const [errorText, setErrorText] = useState<string | undefined>(undefined)

  // 상태관리 hook
  const setErrorState = useSetRecoilState(errorStateSelector)

  useEffect(() => {
    if (formState.errors) {
      const keys = Object.keys(formState.errors)
      const found = keys.some(r => containKeys.includes(r))
      if (keys.length > 0 && found) {
        setErrorText('입력값이 잘못 되었습니다.')
      } else {
        setErrorText(undefined)
      }
    }
  }, [formState.errors])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <Card className={classes.root}>
        <CardActions className={classes.header}>
          <CardHeader
            title={`${t('reserve')} ${t('common.information')}`}
            subheader={errorText && errorText}
            subheaderTypographyProps={{
              color: 'error',
            }}
          />
          <IconButton onClick={handleExpandClick} size="large">
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Divider />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.container}>
            {item?.categoryId === 'education' ? (
              <ReserveEduInfo
                control={control}
                formState={formState}
                totalQty={item?.totalQty}
                setError={setError}
              />
            ) : item?.categoryId === 'space' ? (
              <ReserveSpaceInfo
                control={control}
                formState={formState}
                register={register}
                getValues={getValues}
                item={item}
                setError={setError}
                clearErrors={clearErrors}
              />
            ) : item?.categoryId === 'equipment' ? (
              <ReserveEquipInfo
                control={control}
                formState={formState}
                register={register}
                getValues={getValues}
                item={item}
                setError={setError}
                clearErrors={clearErrors}
              />
            ) : null}
            <Box boxShadow={1} className={classes.attach}>
              <Upload
                ref={fileProps?.uploadRef}
                multi
                attachmentCode={data?.attachmentCode}
                attachData={fileProps?.attachData}
              />
              {fileProps?.attachData && (
                <AttachList
                  data={fileProps.attachData}
                  setData={fileProps.setAttachData}
                />
              )}
            </Box>
          </CardContent>
        </Collapse>
      </Card>
    </>
  )
}

export { ReserveInfo }
