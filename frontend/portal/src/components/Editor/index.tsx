import dynamic from 'next/dynamic'
import Loader from '@components/Loader'

export interface IEditor {
  contents: string
  setContents: (data: string) => void
  readonly?: boolean
}

const Editor = dynamic(() => import('./RichEditor'), {
  ssr: false,
  loading: Loader,
})

export default Editor
