import { DEFAULT_ERROR_MESSAGE } from '@constants'
import { AxiosError } from 'axios'
import { atom, DefaultValue, selector } from 'recoil'

/**
 * Global error 상태관리
 */

interface IErrors {
  defaultMessage: string
  field: string
  rejectedValue?: string
}

export interface IErrorProps {
  open?: boolean
  error?: AxiosError
  status?: number
  message?: string
  errors?: IErrors[]
}

export const errorStateAtom = atom<IErrorProps>({
  key: 'errorStateAtom',
  default: { error: null } as IErrorProps,
})

export const errorStateSelector = selector<IErrorProps>({
  key: 'errorStateSelector',
  get: ({ get }) => {
    return get(errorStateAtom)
  },
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(errorStateAtom)
    } else {
      const error = newValue.error
      let message = error?.message || newValue.message || DEFAULT_ERROR_MESSAGE
      let errors: IErrors[] = []
      let status = newValue.status || 500
      if (error?.response) {
        const data = error.response.data
        if (data && typeof data === 'object') {
          if ('message' in data && typeof data.message === 'string') {
            message = data.message || message
          }
          if ('errors' in data && Array.isArray(data.errors)) {
            errors = data.errors.filter(
              (item): item is IErrors =>
                item && typeof item === 'object' &&
                typeof item.defaultMessage === 'string' &&
                typeof item.field === 'string',
            )
          }
        }
        status = error.response.status
      }

      set(errorStateAtom, {
        open: true,
        error,
        status,
        message,
        errors,
      })
    }
  },
})
