import Loader from '@components/Loader'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useRef, useState } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(1),
      '& .ck-editor__editable_inline': {
        minHeight: '200px',
      },
    },
  }),
)

export interface IEditor {
  contents: string
  setContents: (data: string) => void
}

const Editor = (props: IEditor) => {
  const { contents, setContents } = props
  const classes = useStyles()
  const editorRef = useRef<any>()
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false)
  const { CKEditor, ClassicEditor } = editorRef.current || {}

  useEffect(() => {
    let mounted = true
    Promise.all([import('ckeditor5'), import('@ckeditor/ckeditor5-react')]).then(([editor, integration]) => {
    if (!mounted) return
    const {
      ClassicEditor,
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Link,
      List,
      BlockQuote,
      Image,
      ImageCaption,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      CKFinderUploadAdapter,
      Table,
      TableToolbar,
      MediaEmbed,
      PasteFromOffice,
      Indent,
      Autoformat,
      TextTransformation,
    } = editor
    editorRef.current = {
      CKEditor: integration.CKEditor,
      ClassicEditor,
      plugins: [
        Essentials,
        Paragraph,
        Heading,
        Bold,
        Italic,
        Link,
        List,
        BlockQuote,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        CKFinderUploadAdapter,
        Table,
        TableToolbar,
        MediaEmbed,
        PasteFromOffice,
        Indent,
        Autoformat,
        TextTransformation,
      ],
    }

    setEditorLoaded(true)
    })
    return () => { mounted = false }
  }, [])

  return (
    <>
      {editorLoaded ? (
        <div className={classes.root}>
          <CKEditor
            editor={ClassicEditor}
            data={contents}
            config={{
              licenseKey: 'GPL',
              plugins: editorRef.current.plugins,
              toolbar: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'uploadImage',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo',
              ],
              image: {
                toolbar: [
                  'imageTextAlternative',
                  'toggleImageCaption',
                  'imageStyle:inline',
                  'imageStyle:block',
                  'imageStyle:side',
                ],
              },
              table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
              },
              ckfinder: {
                uploadUrl: `/api/editor`,
              },
            }}
            onReady={(editor: any) => {
              console.info('editor is ready to use', editor)
            }}
            onChange={(event: any, editor: any) => {
              const chanagedata = editor.getData()
              setContents(chanagedata)
            }}
            onBlur={(event: any, editor: any) => {
              console.info('Blur.', editor)
            }}
            onFocus={(event: any, editor: any) => {
              console.info('Focus.', editor)
            }}
          />
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default Editor
