import { useTreeItemStyles } from '@components/DraggableTreeMenu/DraaggableTreeMenuItem'
import Checkbox from '@mui/material/Checkbox'
import Icon from '@mui/material/Icon'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    checked: {
      padding: theme.spacing(0.5),
    },
  }),
)

interface CustomTreeItemProps extends TreeItemProps {
  node: any
  isChecked?: boolean
  handleChecked?: (node: any, checked: boolean) => void
}

const CustomTreeItem = (props: CustomTreeItemProps) => {
  const { node, isChecked, handleChecked, ...rest } = props
  const classes = useStyles()
  const itemClasses = useTreeItemStyles()

  const { i18n } = useTranslation()

  const [checked, setChecked] = useState<boolean>(node.isChecked)

  useEffect(() => {
    if (node) {
      setChecked(node.isChecked)
    }
  }, [node])

  const handleLabelClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault()
    handleChecked(node, !checked)
  }

  return (
    <TreeItem
      label={
        <div
          className={`${itemClasses.labelRoot} ${
            checked ? itemClasses.selected : ''
          }`}
          onClick={handleLabelClick}
        >
          {isChecked && (
            <Checkbox
              className={classes.checked}
              checked={checked}
              color="primary"
              size="small"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          )}
          <Icon fontSize="small" className={itemClasses.labelIcon}>
            {node.icon || 'folder'}
          </Icon>
          <Typography variant="body2" className={itemClasses.labelText}>
            {i18n.language === 'ko' ? node.korName : node.engName}
          </Typography>
        </div>
      }
      classes={{
        root: classes.root,
        label: itemClasses.label,
      }}
      {...rest}
    />
  )
}

export default CustomTreeItem
