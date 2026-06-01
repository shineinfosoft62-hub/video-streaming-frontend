import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import AppBadge from '../common/AppBadge'
import AppButton from '../common/AppButton'
import AppDateInput from '../common/AppDateInput'
import AppInput from '../common/AppInput'
import AppPasswordInput from '../common/AppPasswordInput'
import AppPhoneInput from '../common/AppPhoneInput'
import { ROUTES } from '../../constants/routes'

function Register() {
  return (
    <Box minH="100vh" bg="#0b0d12" color="white" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={0}>
        <Grid
          overflow="hidden"
          rounded={{ base: '28px', lg: '34px' }}
          bg="rgba(15, 18, 27, 0.92)"
          border="1px solid"
          borderColor="whiteAlpha.200"
          boxShadow="0 30px 90px rgba(0, 0, 0, 0.34)"
          templateColumns={{ base: '1fr', lg: '0.9fr 1.1fr' }}
          minH={{ lg: '760px' }}
        >
          <Box
            p={{ base: 7, md: 10, lg: 12 }}
            bgImage="linear-gradient(135deg, rgba(20,184,166,0.5), rgba(225,29,72,0.48)), url(https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80)"
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
                Join Streamly
              </AppBadge>
              <Heading mt={5} fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1" fontWeight="black">
                Build your streaming profile in seconds.
              </Heading>
              <Text mt={5} maxW="520px" color="whiteAlpha.800" lineHeight="8">
                Create an account for watchlists, upload tools, playback review, and a dashboard designed for video teams.
              </Text>
            </Box>
          </Box>

          <Box p={{ base: 7, md: 10, lg: 12 }} display="flex" alignItems="center">
            <Box w="100%" maxW="620px" mx="auto">
              <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1" fontWeight="black">
                Sign up
              </Heading>
              <Text mt={3} color="whiteAlpha.600">
                Enter your details to create your Streamly account.
              </Text>

              <Stack as="form" mt={8} spacing={5}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                  <FormControl isRequired>
                    <FormLabel color="whiteAlpha.800">First name</FormLabel>
                    <AppInput placeholder="First name" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel color="whiteAlpha.800">Last name</FormLabel>
                    <AppInput placeholder="Last name" />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">Email</FormLabel>
                  <AppInput type="email" placeholder="you@example.com" />
                </FormControl>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                  <FormControl isRequired>
                    <FormLabel color="whiteAlpha.800">Birthdate</FormLabel>
                    <AppDateInput />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel color="whiteAlpha.800">Phone number</FormLabel>
                    <AppPhoneInput />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">Password</FormLabel>
                  <AppPasswordInput placeholder="Create a password" />
                </FormControl>

                <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                  <AppButton type="submit" h="54px" flex="1">
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

              <Text mt={6} color="whiteAlpha.700">
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
