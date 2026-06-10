import {
  Box,
  Container,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AppBadge from '../common/AppBadge'
import AppButton from '../common/AppButton'
import AppDateInput from '../common/AppDateInput'
import AppInput from '../common/AppInput'
import AppPasswordInput from '../common/AppPasswordInput'
import AppPhoneInput from '../common/AppPhoneInput'
import { ColorModeButton } from '../ui/color-mode'
import useAppToast from '../common/useAppToast'
import { ROUTES } from '../../constants/routes'
import {
  dateMessage,
  emailMessage,
  emailRegex,
  isAtLeastAge,
  nameLengthMessage,
  nameMaxLength,
  nameMessage,
  nameMinLength,
  nameRegex,
  passwordMessage,
  passwordRegex,
  phoneMessage,
  phoneRegex,
  confirmPasswordMessage,
  parseDate,
} from '../../utils/authValidation'
import { getApiErrorMessage, signUpUser } from '../../service/auth'
import { BIRTHDATE_REQUIRED_FIELD_VALIDATION_MESSAGE, CONFIRM_PASSWORD_REQUIRED_FIELD_VALIDATION_MESSAGE, EMAIL_REQUIRED_FIELD_VALIDATION_MESSAGE, FIRST_NAME_REQUIRED_FIELD_VALIDATION_MESSAGE, LAST_NAME_REQUIRED_FIELD_VALIDATION_MESSAGE, PASSWORD_REQUIRED_FIELD_VALIDATION_MESSAGE,  PHONE_REQUIRED_FIELD_VALIDATION_MESSAGE } from '../../constants/validation'

type RegisterValues = {
  firstName: string
  lastName: string
  email: string
  birthdate: string
  phone: string
  password: string
  confirmPassword: string
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

const initialValues: RegisterValues = {
  firstName: '',
  lastName: '',
  email: '',
  birthdate: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

const allowedNameKeys = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
])

const validateRegister = (values: RegisterValues) => {
  const errors: RegisterErrors = {}
  const firstName = values.firstName.trim()
  const lastName = values.lastName.trim()
  const phoneDigits = values.phone.replace(/\D/g, '')

      if (!firstName) {
        errors.firstName = FIRST_NAME_REQUIRED_FIELD_VALIDATION_MESSAGE
      } else if (firstName.length < nameMinLength || firstName.length > nameMaxLength) {
        errors.firstName = nameLengthMessage
      } else if (!nameRegex.test(firstName)) {
        errors.firstName = nameMessage
      }

  if (!lastName) {
    errors.lastName = LAST_NAME_REQUIRED_FIELD_VALIDATION_MESSAGE
  } else if (lastName.length < nameMinLength || lastName.length > nameMaxLength) {
    errors.lastName = nameLengthMessage
  } else if (!nameRegex.test(lastName)) {
    errors.lastName = nameMessage
  }

  if (!values.email.trim()) {
    errors.email = EMAIL_REQUIRED_FIELD_VALIDATION_MESSAGE
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = emailMessage
  }

  if (!values.birthdate.trim()) {
    errors.birthdate = BIRTHDATE_REQUIRED_FIELD_VALIDATION_MESSAGE
  } else if (!parseDate(values.birthdate)) {
    errors.birthdate = dateMessage
  } else if (!isAtLeastAge(values.birthdate, 18)) {
    errors.birthdate = 'You must be at least 18 years old.'
  }

  if (!phoneDigits) {
    errors.phone = PHONE_REQUIRED_FIELD_VALIDATION_MESSAGE
  } else if (!phoneRegex.test(phoneDigits)) {
    errors.phone = phoneMessage
  }

  if (!values.password) {
    errors.password = PASSWORD_REQUIRED_FIELD_VALIDATION_MESSAGE
  } else if (!passwordRegex.test(values.password)) {
    errors.password = passwordMessage
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = CONFIRM_PASSWORD_REQUIRED_FIELD_VALIDATION_MESSAGE
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = confirmPasswordMessage
  }

  return errors
}

function Register() {
  const navigate = useNavigate()
  const { showApiToast } = useAppToast()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pageBg = useColorModeValue(
    'linear-gradient(135deg, #f8fafc 0%, #eef8f6 48%, #fff1f2 100%)',
    'radial-gradient(circle at top right, rgba(225,29,72,0.2), transparent 32%), #0b0d12',
  )
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(15, 18, 27, 0.92)')
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')
  const headingColor = useColorModeValue('#172033', 'white')
  const mutedColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.600')
  const labelColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.800')
  const panelOverlay = useColorModeValue(
    'linear-gradient(135deg, rgba(225,29,72,0.5), rgba(20,184,166,0.6))',
    'linear-gradient(135deg, rgba(20,184,166,0.5), rgba(225,29,72,0.48))',
  )

  const updateValue = (field: keyof RegisterValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormError('')
  }

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      allowedNameKeys.has(event.key) ||
      /^[A-Za-z ]$/.test(event.key)
    ) {
      return
    }

    event.preventDefault()
  }

  const handleNamePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (/[^A-Za-z ]/.test(event.clipboardData.getData('text'))) {
      event.preventDefault()
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault()
    const nextErrors = validateRegister(values)

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const response = await signUpUser({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        dob: values.birthdate,
        phone: values.phone.replace(/\D/g, ''),
        password: values.password,
      })
      showApiToast(response.message, 'success')
      navigate(ROUTES.SIGN_IN)
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
      <Container maxW="7xl" px={0}>
        <Grid
          overflow="hidden"
          rounded={{ base: '28px', lg: '34px' }}
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          boxShadow="0 30px 90px rgba(0, 0, 0, 0.34)"
          templateColumns={{ base: '1fr', lg: '0.9fr 1.1fr' }}
          minH={{ lg: '700px' }}
          backdropFilter="blur(18px)"
        >
          <Box
            p={{ base: 7, md: 10, lg: 12 }}
            bgImage={`${panelOverlay}, url(https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80)`}
            bgSize="cover"
            bgPosition="center"
            color="white"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Link as={RouterLink} to={ROUTES.home} fontSize="xl" fontWeight="black" _hover={{ textDecoration: 'none' }}>
              Streamly
            </Link>
            <Box mt={{ base: 16, lg: 0 }}>
              <AppBadge bg="white" color="#111827">
                Join Streamly
              </AppBadge>
              <Heading mt={5} fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1" fontWeight="black">
                Build your streaming profile in seconds.
              </Heading>
              <Text mt={5} maxW="520px" color="whiteAlpha.900" lineHeight="8">
                Create an account for watchlists, upload tools, playback review, and a dashboard designed for video teams.
              </Text>
            </Box>
          </Box>

          <Box p={{ base: 7, md: 10, lg: 12 }} display="flex" alignItems="center">
            <Box w="100%" maxW="620px" mx="auto">
              <HStack justify="space-between" align="start" spacing={4}>
                <Box>
                  <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1" fontWeight="black" color={headingColor}>
                    Sign up
                  </Heading>
                  <Text mt={3} color={mutedColor}>
                    Enter your details to create your Streamly account.
                  </Text>
                </Box>
                <ColorModeButton />
              </HStack>

              <Stack as="form" mt={8} spacing={5} noValidate onSubmit={handleSubmit}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                  <FormControl isRequired isInvalid={Boolean(errors.firstName)}>
                    <FormLabel color={labelColor}>First name</FormLabel>
                    <AppInput
                      value={values.firstName}
                      placeholder="First name"
                      minLength={nameMinLength}
                      maxLength={nameMaxLength}
                      onChange={(event) => updateValue('firstName', event.target.value)}
                      onKeyDown={handleNameKeyDown}
                      onPaste={handleNamePaste}
                    />
                    <FormErrorMessage color="red.300">{errors.firstName}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={Boolean(errors.lastName)}>
                    <FormLabel color={labelColor}>Last name</FormLabel>
                    <AppInput
                      value={values.lastName}
                      placeholder="Last name"
                      minLength={nameMinLength}
                      maxLength={nameMaxLength}
                      onChange={(event) => updateValue('lastName', event.target.value)}
                      onKeyDown={handleNameKeyDown}
                      onPaste={handleNamePaste}
                    />
                    <FormErrorMessage color="red.300">{errors.lastName}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

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

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                  <FormControl isRequired isInvalid={Boolean(errors.birthdate)}>
                    <FormLabel color={labelColor}>Birthdate</FormLabel>
                    <AppDateInput
                      value={values.birthdate}
                      maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                      onChange={(value) => updateValue('birthdate', value)}
                    />
                    <FormErrorMessage color="red.300">{errors.birthdate}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={Boolean(errors.phone)}>
                    <FormLabel color={labelColor}>Phone number</FormLabel>
                    <AppPhoneInput
                      value={values.phone}
                      onChange={(value) => updateValue('phone', value)}
                    />
                    <FormErrorMessage color="red.300">{errors.phone}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                <FormControl isRequired isInvalid={Boolean(errors.password)}>
                  <FormLabel color={labelColor}>Password</FormLabel>
                  <AppPasswordInput
                    value={values.password}
                    placeholder="Create a password"
                    onChange={(event) => updateValue('password', event.target.value)}
                  />
                  <FormErrorMessage color="red.300">{errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={Boolean(errors.confirmPassword)}>
                  <FormLabel color={labelColor}>Confirm Password</FormLabel>
                  <AppPasswordInput
                    value={values.confirmPassword}
                    placeholder="Confirm your password"
                    onChange={(event) => updateValue('confirmPassword', event.target.value)}
                  />
                  <FormErrorMessage color="red.300">{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                {formError && (
                  <Text color="red.300" fontSize="sm" fontWeight="semibold">
                    {formError}
                  </Text>
                )}
              </SimpleGrid>
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                  <AppButton type="submit" h="54px" flex="1" isLoading={isSubmitting}>
                    Create Account
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

              <Text mt={6} color={mutedColor}>
                Already have an account?{' '}
                <Link as={RouterLink} to={ROUTES.SIGN_IN} color="#38bdf8" fontWeight="bold">
                  Sign in
                </Link>
              </Text>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  )
}

export default Register
