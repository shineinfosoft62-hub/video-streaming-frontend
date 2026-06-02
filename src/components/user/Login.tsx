import {
  Box,
  Container,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState, type FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AppBadge from '../common/AppBadge'
import AppButton from '../common/AppButton'
import AppInput from '../common/AppInput'
import AppPasswordInput from '../common/AppPasswordInput'
import useAppToast from '../common/useAppToast'
import { ROUTES } from '../../constants/routes'
import {
  emailMessage,
  emailRegex,
  passwordMessage,
  passwordRegex,
} from '../../utils/authValidation'
import { getApiErrorMessage, signInUser } from '../../service/auth'

type LoginValues = {
  email: string
  password: string
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>

const validateLogin = (values: LoginValues) => {
  const errors: LoginErrors = {}

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = emailMessage
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (!passwordRegex.test(values.password)) {
    errors.password = passwordMessage
  }

  return errors
}

function Login() {
  const navigate = useNavigate()
  const { showApiToast } = useAppToast()
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateValue = (field: keyof LoginValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault()
    const nextErrors = validateLogin(values)

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const response = await signInUser({
        email: values.email.trim(),
        password: values.password,
      })
      showApiToast(response.message, 'success')
      navigate(ROUTES.DASHBOARD)
    } catch (error) {
      const message = getApiErrorMessage(error)

      setFormError(message)
      showApiToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box minH="100vh" bg="#0b0d12" color="white" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <Container maxW="6xl" px={0}>
        <Grid
          overflow="hidden"
          rounded={{ base: '28px', lg: '34px' }}
          bg="rgba(15, 18, 27, 0.92)"
          border="1px solid"
          borderColor="whiteAlpha.200"
          boxShadow="0 30px 90px rgba(0, 0, 0, 0.34)"
          templateColumns={{ base: '1fr', lg: '0.95fr 1.05fr' }}
          minH={{ lg: '720px' }}
        >
          <Box
            p={{ base: 7, md: 10, lg: 12 }}
            bgImage="linear-gradient(135deg, rgba(225,29,72,0.62), rgba(20,184,166,0.32)), url(https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80)"
            bgSize="cover"
            bgPosition="center"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Link as={RouterLink} to={ROUTES.home} fontSize="xl" fontWeight="black" _hover={{ textDecoration: 'none' }}>
              Streamly
            </Link>
            <Box mt={{ base: 16, lg: 0 }}>
              <AppBadge bg="white" color="#111827">
                Welcome back
              </AppBadge>
              <Heading mt={5} fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1" fontWeight="black">
                Pick up right where the story paused.
              </Heading>
              <Text mt={5} maxW="520px" color="whiteAlpha.800" lineHeight="8">
                Sign in to manage uploads, review DASH playback, and keep your streaming dashboard moving.
              </Text>
            </Box>
          </Box>

          <Box p={{ base: 7, md: 10, lg: 12 }} display="flex" alignItems="center">
            <Box w="100%" maxW="460px" mx="auto">
              <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1" fontWeight="black">
                Sign in
              </Heading>
              <Text mt={3} color="whiteAlpha.600">
                Use your Streamly account to continue.
              </Text>

              <Stack
                as="form"
                mt={8}
                spacing={5}
                noValidate
                onSubmit={handleSubmit}
              >
                <FormControl isRequired isInvalid={Boolean(errors.email)}>
                  <FormLabel color="whiteAlpha.800">Email</FormLabel>
                  <AppInput
                    type="email"
                    value={values.email}
                    placeholder="you@example.com"
                    onChange={(event) => updateValue('email', event.target.value)}
                  />
                  <FormErrorMessage color="red.300">{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={Boolean(errors.password)}>
                  <FormLabel color="whiteAlpha.800">Password</FormLabel>
                  <AppPasswordInput
                    value={values.password}
                    placeholder="Enter your password"
                    onChange={(event) => updateValue('password', event.target.value)}
                  />
                  <FormErrorMessage color="red.300">{errors.password}</FormErrorMessage>
                </FormControl>
                {formError && (
                  <Text color="red.300" fontSize="sm" fontWeight="semibold">
                    {formError}
                  </Text>
                )}
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                  <AppButton type="submit" h="54px" flex="1" isLoading={isSubmitting}>
                    Sign In
                  </AppButton>
                  <AppButton
                    as={RouterLink}
                    to={ROUTES.home}
                    type="button"
                    h="54px"
                    flex="1"
                  >
                    Cancel
                  </AppButton>
                </Stack>
              </Stack>

              <Text mt={6} color="whiteAlpha.700">
                New to Streamly?{' '}
                <Link as={RouterLink} to={ROUTES.SIGN_UP} color="#38bdf8" fontWeight="bold">
                  Create an account
                </Link>
              </Text>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  )
}

export default Login
