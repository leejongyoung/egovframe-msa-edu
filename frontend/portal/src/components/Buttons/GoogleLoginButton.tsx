import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from '@constants/env'
import CustomConfirm, { CustomConfirmPrpps } from '@components/CustomConfirm'

export interface ISocialButton {
  handleClick?: (response: unknown) => void
  confirmMessage?: string
}

const GoogleLoginButton = ({ handleClick, confirmMessage }: ISocialButton) => {
  const { i18n } = useTranslation()
  const [customConfirm, setCustomConfirm] = useState<CustomConfirmPrpps | null>(null)

  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale={i18n.language}>
        <GoogleLogin
          onSuccess={({ credential }) => {
            if (!credential) {
              handleClick?.({ error: 'missing_credential' })
              return
            }
            // Only identify the selected account here; the backend verifies the ID token.
            const payload: unknown = JSON.parse(atob(credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
            if (!payload || typeof payload !== 'object' || !('sub' in payload) || typeof payload.sub !== 'string') {
              handleClick?.({ error: 'invalid_credential' })
              return
            }
            const response = { tokenId: credential, googleId: payload.sub }
            if (confirmMessage) {
              setCustomConfirm({
                open: true,
                contentText: confirmMessage,
                handleConfirm: () => {
                  setCustomConfirm(null)
                  handleClick?.(response)
                },
                handleCancel: () => setCustomConfirm(null),
              })
            } else {
              handleClick?.(response)
            }
          }}
          onError={() => handleClick?.({ error: 'google_login_failed' })}
        />
      </GoogleOAuthProvider>
      {customConfirm && <CustomConfirm {...customConfirm} />}
    </>
  )
}

export { GoogleLoginButton }
