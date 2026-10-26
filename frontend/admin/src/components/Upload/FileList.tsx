import React, { useContext, useEffect, useState } from 'react'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import FolderIcon from '@mui/icons-material/Folder'
import ListItemText from '@mui/material/ListItemText'
import { IFile } from '@service'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatBytes } from '@utils'
import { produce } from 'immer'
import { FileContext } from '.'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '1px',
      padding: 0,
    },
    list: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(0),
    },
    item: {
      padding: theme.spacing(1, 6, 1, 1),
    },
    pd0: {
      padding: theme.spacing(0),
    },
  }),
)

interface IFileList {
  key: string
  name: string
  size: number
}

const FileList = () => {
  const classes = useStyles()

  const { selectedFiles, setSelectedFilesHandler } = useContext(FileContext)
  const [fileList, setFileList] = useState<IFileList[]>([])

  useEffect(() => {
    let list: IFileList[] = []

    for (const key in selectedFiles) {
      if (Object.prototype.hasOwnProperty.call(selectedFiles, key)) {
        const item = selectedFiles[key]
        list.push({
          key: item.key,
          name: item.file.name,
          size: item.file.size,
        })
      }
    }

    setFileList(list)
  }, [selectedFiles])

  const handleDelete = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    key: string,
  ) => {
    event.preventDefault()

    const index = selectedFiles.findIndex(item => item.key === key)
    const newFiles: IFile[] = produce(selectedFiles, draft => {
      draft.splice(index, 1)
    })

    setSelectedFilesHandler(newFiles)
  }
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid>
          <div>
            {fileList && (
              <List className={classes.list}>
                {fileList.map(item => (
                  <ListItem key={item.key} className={classes.item}>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={formatBytes(item.size)}
                    />
                    <ListItemSecondaryAction
                      onClick={event => handleDelete(event, item.key)}
                    >
                      <IconButton edge="end" aria-label="delete" size="large">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default FileList
