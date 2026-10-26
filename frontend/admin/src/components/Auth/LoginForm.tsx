import React, { useState } from 'react'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import { useForm } from 'react-hook-form'
import { PageProps } from '@pages/_app'
import { EmailStorage } from '@libs/Storage/emailStorage'
import { DEFAULT_APP_NAME } from '@constants'
import { EMAIL_PATTERN } from '@utils'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export type loginFormType = {
  email?: string
  password?: string
  isRemember?: boolean
}

interface ILoginFormProps extends PageProps {
  errorMessage?: string
  handleLogin: ({ email, password }: loginFormType) => void
}

const LoginForm = ({ handleLogin, errorMessage }: ILoginFormProps) => {
  const classes = useStyles()
  const emails = new EmailStorage('login')

  const [checked, setChecked] = useState<boolean>(emails.get().isRemember)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<loginFormType>()

  const onSubmit = (formData: loginFormType) => {
    setRemember()
    handleLogin({
      email: formData.email,
      password: formData.password,
    })
  }

  const setRemember = () => {
    if (checked) {
      emails.set({
        email: getValues('email'),
        isRemember: checked,
      })
    } else {
      emails.clear()
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    setRemember()
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {DEFAULT_APP_NAME}
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            defaultValue={emails.get().email}
            {...register('email', {
              required: 'Email Address is required!!',
              pattern: {
                value: EMAIL_PATTERN,
                message: 'Email Address의 형식이 맞지 않습니다.',
              },
            })}
          />
          {errors.email && (
            <Alert severity="warning">{errors.email.message}</Alert>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', {
              required: 'Password is required!!',
            })}
          />
          {errors.password && (
            <Alert severity="warning">{errors.password.message}</Alert>
          )}
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                onChange={handleChange}
                checked={checked}
              />
            }
            label="아이디 저장"
          />
          {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  )
}

export default LoginForm
