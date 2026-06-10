import {
  Box,
  Container,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState, type FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
  const pageBg = useColorModeValue('#f6f8fb', '#0b0d12')
  const cardBg = useColorModeValue('white', 'rgba(15, 18, 27, 0.92)')
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')
  const headingColor = useColorModeValue('#172033', 'white')
  const textColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const labelColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800')

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
    <Box minH="100vh" bg={pageBg} color={headingColor} px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <Container maxW="md" px={0}>
        <Box textAlign="center" mb={6}>
          <Link as={RouterLink} to={ROUTES.home} fontSize="2xl" fontWeight="black" _hover={{ textDecoration: 'none' }}>
            Streamly
          </Link>
          <Text mt={2} color={textColor}>
            Sign in to continue to your streaming dashboard.
          </Text>
        </Box>

        <Box
          rounded="3xl"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          boxShadow="0 24px 70px rgba(23, 32, 51, 0.12)"
          p={{ base: 6, md: 8 }}
        >
          <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1" fontWeight="black" color={headingColor}>
            Sign in
          </Heading>
          <Text mt={3} color={textColor}>
            Use your Streamly account details below.
          </Text>

          <Stack as="form" mt={8} spacing={5} noValidate onSubmit={handleSubmit}>
            <FormControl isRequired isInvalid={Boolean(errors.email)}>
              <FormLabel color={labelColor}>Email</FormLabel>
              <AppInput
                type="email"
                value={values.email}
                placeholder="you@example.com"
                onChange={(event) => updateValue('email', event.target.value)}
              />
              <FormErrorMessage color="red.300">{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.password)}>
              <FormLabel color={labelColor}>Password</FormLabel>
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
              <AppButton type="submit" h="52px" flex="1" isLoading={isSubmitting}>
                Sign In
              </AppButton>
              <AppButton as={RouterLink} to={ROUTES.home} type="button" h="52px" flex="1" variant="outline">
                Cancel
              </AppButton>
            </Stack>
          </Stack>

          <Text mt={6} color={textColor} textAlign="center">
            New to Streamly?{' '}
            <Link as={RouterLink} to={ROUTES.SIGN_UP} color="#38bdf8" fontWeight="bold">
              Create an account
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
