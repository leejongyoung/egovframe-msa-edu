import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  Autoformat, BlockQuote, Bold, CKFinderUploadAdapter, ClassicEditor,
  Essentials, Heading, Image, ImageCaption, ImageStyle, ImageToolbar,
  ImageUpload, Indent, Italic, Link, List, MediaEmbed, Paragraph,
  PasteFromOffice, Table, TableToolbar, TextTransformation,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import type { IEditor } from '.'

const RichEditor = ({ contents, setContents, readonly = false }: IEditor) => (
  <div id="editor" className={readonly ? 'editor-readonly' : ''}>
    <CKEditor
      editor={ClassicEditor}
      data={contents}
      disabled={readonly}
      config={{
        licenseKey: 'GPL',
        plugins: [
          Autoformat, BlockQuote, Bold, CKFinderUploadAdapter, Essentials,
          Heading, Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload,
          Indent, Italic, Link, List, MediaEmbed, Paragraph, PasteFromOffice,
          Table, TableToolbar, TextTransformation,
        ],
        toolbar: [
          'heading', '|', 'bold', 'italic', 'link', 'bulletedList',
          'numberedList', '|', 'outdent', 'indent', '|', 'uploadImage',
          'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo',
        ],
        image: {
          toolbar: ['imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
        },
        table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
        ckfinder: { uploadUrl: '/api/editor' },
      }}
      onChange={(_, editor) => setContents(editor.getData())}
    />
  </div>
)

export default RichEditor
