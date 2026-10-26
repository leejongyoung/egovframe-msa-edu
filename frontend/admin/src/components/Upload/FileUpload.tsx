import React, { useContext, useEffect, useState } from 'react'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import Divider from '@mui/material/Divider'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Button from '@mui/material/Button'
import { DEFAULT_ACCEPT_FILE_EXT } from '@constants'
import { IFile } from '@service'
import { FileContext, UploadProps } from '.'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    fileInput: {
      display: 'none',
    },
  }),
)

const FileUpload = (props: UploadProps) => {
  const { accept, multi } = props
  const classes = useStyles()

  const { t } = useTranslation()

  const { selectedFiles, setSelectedFilesHandler } = useContext(FileContext)
  const [fileCnt, setFileCnt] = useState<number>(0)

  useEffect(() => {
    setFileCnt(selectedFiles?.length || 0)
  }, [selectedFiles])

  const handleChangeFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    let newSelectedFiles: IFile[] = []
    for (const key in fileList) {
      if (Object.prototype.hasOwnProperty.call(fileList, key)) {
        const item = fileList[key]
        newSelectedFiles.push({
          key: `${Math.random().toString(36).substr(2, 11)}`,
          file: item,
        })
      }
    }

    if (selectedFiles !== undefined) {
      newSelectedFiles = newSelectedFiles.concat(selectedFiles)
    }

    setSelectedFilesHandler(newSelectedFiles)
  }

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder={t('file.placeholder')}
        inputProps={{ 'aria-label': 'add attachments' }}
        value={fileCnt === 0 ? '' : `${fileCnt} 개의 파일이 선택되었습니다.`}
      />

      <Divider className={classes.divider} orientation="vertical" />
      <input
        accept={accept || DEFAULT_ACCEPT_FILE_EXT}
        className={classes.fileInput}
        id="contained-button-file"
        onChange={handleChangeFiles}
        multiple={multi}
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          <AttachFileIcon /> {t('file.search')}
        </Button>
      </label>
    </Paper>
  )
}

export default FileUpload
