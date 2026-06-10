import {
  Box,
  type BoxProps,
  type ButtonProps,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import AppBadge from '../components/common/AppBadge'
import AppButton from '../components/common/AppButton'
import AppInput from '../components/common/AppInput'
import AppTextarea from '../components/common/AppTextarea'
import ColorModeButton from '../components/common/ColorModeButton'
import { ROUTES } from '../constants/routes'
import { navItems, collections,features, } from '../constants/landingdata'

function ShinyButton({ children, to, ...props }: ButtonProps & { to: string }) {
  return (
    <AppButton
      as={RouterLink}
      to={to}
      rounded="full"
      bg="#e11d48"
      color="white"
      h="42px"
      px={5}
      fontSize="sm"
      position="relative"
      overflow="hidden"
      boxShadow="0 0 24px rgba(225, 29, 72, 0.38)"
      _before={{
        content: '""',
        position: 'absolute',
        top: '-45%',
        bottom: '-45%',
        left: '-60%',
        width: '42%',
        bg: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
        transform: 'rotate(18deg)',
        animation: 'shineSweep 2.6s ease-in-out infinite',
      }}
      sx={{
        '@keyframes shineSweep': {
          '0%': { left: '-60%' },
          '52%': { left: '122%' },
          '100%': { left: '122%' },
        },
      }}
      _hover={{ bg: '#be123c', textDecoration: 'none', boxShadow: '0 0 32px rgba(225, 29, 72, 0.58)' }}
      {...props}
    >
      <Box as="span" position="relative" zIndex={1}>
        {children}
      </Box>
    </AppButton>
  )
}

function Landing() {
  const pageBg = useColorModeValue('#f6f8fb', '#0b0d12')
  const pageColor = useColorModeValue('#172033', 'white')
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.86)', 'rgba(11, 13, 18, 0.86)')
  const headerBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')
  const navColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const navHoverColor = useColorModeValue('#172033', 'white')
  const textColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const outlineBorder = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  const outlineHoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const sectionBg = useColorModeValue('linear-gradient(135deg, #ffffff 0%, #f7f3f6 50%, #eef6f5 100%)', 'linear-gradient(135deg, #111827 0%, #251026 50%, #111827 100%)')
  const featureCardBg = useColorModeValue('white', 'rgba(255,255,255,0.08)')
  const featureCardBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')
  const featureCardColor = useColorModeValue('#172033', 'white')
  const featureDescriptionColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.800')
  const contactBg = useColorModeValue('#eef2f7', 'linear-gradient(180deg, rgba(11,13,18,0.94), rgba(11,13,18,0.82)), url(https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1800&q=80)')
  const contactCardBg = useColorModeValue('white', 'rgba(13, 16, 24, 0.82)')
  const contactCardBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')
  const footerBg = useColorModeValue('white', '#05070c')
  const footerColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.800')

  return (
      <Box minH="100vh" bg={pageBg} color={pageColor}>
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="50"
        borderBottom="1px solid"
        borderColor={headerBorder}
        bg={headerBg}
        backdropFilter="blur(18px)"
      >
        <Container maxW="7xl" px={{ base: 5, md: 8 }} py={4}>
          <Flex align="center" justify="space-between" gap={5}>
            <Link
              href="#home"
              fontSize="xl"
              fontWeight="black"
              letterSpacing="tight"
              _hover={{ textDecoration: 'none' }}
            >
              Streamly
            </Link>

            <Flex
              display={{ base: 'none', md: 'flex' }}
              align="center"
              gap={7}
              color={navColor}
              fontSize="sm"
              fontWeight="semibold"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  _hover={{ color: navHoverColor, textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              ))}
            </Flex>

            <Flex align="center" gap={3}>
              <AppButton
                as={RouterLink}
                to={ROUTES.SIGN_UP}
                rounded="full"
                bg="transparent"
                color={pageColor}
                h="42px"
                px={5}
                fontSize="sm"
                border="1px solid"
                borderColor={outlineBorder}
                display={{ base: 'none', sm: 'inline-flex' }}
                _hover={{ bg: outlineHoverBg, textDecoration: 'none' }}
              >
                Sign Up
              </AppButton>
              <ColorModeButton />
              <ShinyButton to={ROUTES.SIGN_IN}>
                Sign in
              </ShinyButton>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container
        as="section"
        id="home"
        maxW="7xl"
        px={{ base: 5, md: 8 }}
        pt={{ base: 12, lg: 20 }}
        pb={{ base: 20, lg: 28 }}
      >
        <Grid
          gap={{ base: 12, lg: 16 }}
          alignItems="center"
          templateColumns={{ base: '1fr', lg: '0.88fr 1.12fr' }}
        >
          <Box>
            <AppBadge
              rounded="full"
              px={4}
              py={2}
              bg="#e11d48"
              color="white"
              letterSpacing="0.12em"
              textTransform="uppercase"
            >
              Premium streaming hub
            </AppBadge>

            <Heading
              as="h1"
              mt={7}
              maxW="720px"
              fontSize={{ base: '48px', sm: '64px', lg: '82px' }}
              lineHeight="0.94"
              fontWeight="black"
              letterSpacing="tight"
            >
              Stream movies, series, and live moments in one place.
            </Heading>

            <Text mt={7} maxW="620px" fontSize="lg" lineHeight="8" color={textColor}>
              A cinematic streaming platform for binge-worthy originals, live
              events, family profiles, and watchlists that follow you from
              phone to living room.
            </Text>

            <Stack mt={9} direction={{ base: 'column', sm: 'row' }} spacing={3}>
              <ShinyButton to={ROUTES.DASHBOARD} h="52px" px={8}>
                Get Started
              </ShinyButton>
              <AppButton
                as={RouterLink}
                to={ROUTES.SIGN_UP}
                h="52px"
                px={8}
                rounded="full"
                bg="transparent"
                border="1px solid"
                borderColor={outlineBorder}
                color={pageColor}
                fontWeight="bold"
                _hover={{ bg: outlineHoverBg, textDecoration: 'none' }}
              >
                Sign Up
              </AppButton>
            </Stack>
          </Box>

          <StreamingWall />
        </Grid>
      </Container>

      <Box
        as="section"
        id="about"
        bg={sectionBg}
        color={pageColor}
        px={{ base: 5, md: 8 }}
        py={20}
      >
        <Container maxW="7xl" px={0}>
          <Grid
            gap={{ base: 10, lg: 14 }}
            alignItems="center"
            templateColumns={{ base: '1fr', lg: '0.95fr 1.05fr' }}
          >
            <Box>
              <Text
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="0.22em"
                color="#38bdf8"
              >
                About Us
              </Text>
              <Heading
                as="h2"
                mt={4}
                fontSize={{ base: '4xl', md: '6xl' }}
                lineHeight="1"
                fontWeight="black"
              >
                Entertainment that feels personal the second you press play.
              </Heading>
              <Text mt={6} maxW="560px" color={textColor} lineHeight="8">
                Streamly brings movies, series, live sports, and kids content
                into a clean streaming experience with sharp discovery, fast
                playback, and profiles for every viewer.
              </Text>
            </Box>

            <Box
              position="relative"
              minH={{ base: '300px', md: '360px' }}
              rounded="40px"
              overflow="hidden"
              bg="#05070c"
              boxShadow="2xl"
            >
              <Box
                position="absolute"
                inset="0"
                bg="linear-gradient(135deg, rgba(225,29,72,0.42), rgba(20,184,166,0.2)), url(https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80)"
                bgSize="cover"
                bgPosition="center"
              />
              <Box
                position="absolute"
                left={6}
                right={6}
                bottom={6}
                rounded="3xl"
                bg="rgba(255,255,255,0.9)"
                p={5}
                color="#111827"
              >
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.600">
                  Tonight's spotlight
                </Text>
                <Heading as="h3" mt={2} fontSize="2xl" fontWeight="black">
                  Pick up the next episode without losing the mood.
                </Heading>
              </Box>
            </Box>
          </Grid>

          <SimpleGrid mt={12} columns={{ base: 1, md: 3 }} spacing={5}>
            {features.map((feature, index) => (
              <Box
                as="article"
                key={feature.title}
                minH="260px"
                rounded="3xl"
                border="1px solid"
                borderColor={featureCardBorder}
                bg={index === 1 ? '#e11d48' : featureCardBg}
                color={index === 1 ? 'white' : featureCardColor}
                p={7}
                boxShadow="xl"
              >
                <Text
                  fontSize="5xl"
                  fontWeight="black"
                  color={index === 1 ? '#fff1f2' : '#38bdf8'}
                >
                  0{index + 1}
                </Text>
                <Heading as="h3" mt={8} fontSize="2xl" fontWeight="black">
                  {feature.title}
                </Heading>
                <Text
                  mt={4}
                  lineHeight="7"
                  color={index === 1 ? 'whiteAlpha.800' : featureDescriptionColor}
                >
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          <SimpleGrid mt={5} columns={{ base: 1, md: 3 }} spacing={5}>
            {collections.map((collection) => (
              <CollectionCard key={collection.title} {...collection} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box
        as="section"
        id="contact"
        px={{ base: 5, md: 8 }}
        py={{ base: 16, lg: 24 }}
        bg={contactBg}
        bgSize="cover"
        bgPosition="center"
        bgAttachment={{ base: 'scroll', lg: 'fixed' }}
      >
        <Container maxW="7xl" px={0}>
          <Grid
            overflow="hidden"
            rounded={{ base: '28px', lg: '32px' }}
            bg={contactCardBg}
            border="1px solid"
            borderColor={contactCardBorder}
            boxShadow="0 30px 90px rgba(0, 0, 0, 0.38)"
            backdropFilter="blur(14px)"
            templateColumns={{ base: '1fr', lg: '0.95fr 1.05fr' }}
          >
            <Box
              p={{ base: 7, md: 12 }}
              minH={{ base: 'auto', lg: '560px' }}
              position="relative"
              bgImage="linear-gradient(135deg, rgba(17,24,39,0.94), rgba(17,24,39,0.72)), url(https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80)"
              bgSize="cover"
              bgPosition="center"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box>
              <Text
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="0.22em"
                color="#fb7185"
              >
                Contact
              </Text>
              <Heading
                as="h2"
                mt={4}
                fontSize={{ base: '4xl', md: '6xl' }}
                lineHeight="1"
                fontWeight="black"
              >
                Start streaming without the scroll fatigue.
              </Heading>
              <Text mt={6} maxW="xl" lineHeight="8" color="whiteAlpha.700">
                Tell us what you like to watch and we will point you toward the
                right plan, device setup, and profiles for your household.
              </Text>
              </Box>

              <Box
                mt={10}
                rounded="2xl"
                bg="rgba(5, 7, 12, 0.88)"
                color="white"
                p={6}
                border="1px solid"
                borderColor="whiteAlpha.200"
                maxW="580px"
              >
                <Text fontSize="sm" color="whiteAlpha.700">
                  Popular plan
                </Text>
                <Text mt={2} fontSize="2xl" fontWeight="black">
                  4K streaming, downloads, four profiles
                </Text>
              </Box>
            </Box>

            <Box
              as="form"
              bgImage="linear-gradient(135deg, rgba(5,7,12,0.82), rgba(17,24,39,0.72)), url(https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1200&q=80)"
              bgSize="cover"
              bgPosition="center"
              p={{ base: 6, sm: 7, md: 10 }}
              color="white"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              borderLeft={{ base: '0', lg: '1px solid' }}
              borderColor="whiteAlpha.200"
            >
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="bold" color="whiteAlpha.800">
                    Name
                  </FormLabel>
                  <AppInput
                    h="52px"
                    rounded="full"
                    bg="rgba(5, 7, 12, 0.88)"
                    color="white"
                    borderColor="whiteAlpha.200"
                    placeholder="Your name"
                    _placeholder={{ color: 'whiteAlpha.600' }}
                    _focusVisible={{ borderColor: '#e11d48', boxShadow: '0 0 0 1px #e11d48' }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="bold" color="whiteAlpha.800">
                    Email
                  </FormLabel>
                  <AppInput
                    h="52px"
                    rounded="full"
                    bg="rgba(5, 7, 12, 0.88)"
                    color="white"
                    borderColor="whiteAlpha.200"
                    placeholder="you@example.com"
                    type="email"
                    _placeholder={{ color: 'whiteAlpha.600' }}
                    _focusVisible={{ borderColor: '#e11d48', boxShadow: '0 0 0 1px #e11d48' }}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl mt={5}>
                <FormLabel fontSize="sm" fontWeight="bold" color="whiteAlpha.800">
                  Message
                </FormLabel>
                <AppTextarea
                  minH="170px"
                  rounded="3xl"
                  bg="rgba(5, 7, 12, 0.88)"
                  color="white"
                  borderColor="whiteAlpha.200"
                  placeholder="Tell us what you want to watch..."
                  _placeholder={{ color: 'whiteAlpha.600' }}
                  resize="vertical"
                  _focusVisible={{ borderColor: '#e11d48', boxShadow: '0 0 0 1px #e11d48' }}
                />
              </FormControl>

              <AppButton
                mt={6}
                w="full"
                h="54px"
                rounded="full"
                bg="#e11d48"
                color="white"
                fontWeight="bold"
                type="submit"
                _hover={{ bg: '#be123c' }}
              >
                Request Access
              </AppButton>
            </Box>
          </Grid>
        </Container>
      </Box>

      <Box as="footer" bg={footerBg} color={footerColor} px={{ base: 5, md: 8 }} py={8}>
        <Container maxW="7xl" px={0}>
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'flex-start', sm: 'center' }}
            justify="space-between"
            gap={4}
            fontSize="sm"
          >
            <Text>(c) 2026 Streamly. All rights reserved.</Text>
            <Flex gap={5}>
              {navItems.slice(1).map((item) => (
                <Link key={item.href} href={item.href} _hover={{ color: navHoverColor }}>
                  {item.label.replace(' Us', '')}
                </Link>
              ))}
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

function StreamingWall() {
  const wallBg = useColorModeValue('#e6edf3', '#171923')
  const floatingCardBg = useColorModeValue('rgba(255,255,255,0.94)', 'rgba(255,255,255,0.94)')

  return (
    <Box position="relative" minH={{ base: '560px', md: '680px' }}>
      <Box
        position="absolute"
        inset={{ base: '24px 0 0 0', md: '40px 30px 0 40px' }}
        rounded="40px"
        bg={wallBg}
      />
      <Artwork
        top="0"
        left={{ base: '0', md: '18px' }}
        width={{ base: '58%', md: '46%' }}
        height="330px"
        image="linear-gradient(160deg, rgba(225,29,72,0.18), rgba(5,7,12,0.28)), url(https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80)"
        label="Originals"
      />
      <Artwork
        top={{ base: '68px', md: '88px' }}
        right="0"
        width={{ base: '54%', md: '48%' }}
        height="410px"
        image="linear-gradient(160deg, rgba(20,184,166,0.18), rgba(5,7,12,0.42)), url(https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=900&q=80)"
        label="Continue Watching"
      />
      <Artwork
        bottom="0"
        left={{ base: '16px', md: '92px' }}
        width={{ base: '66%', md: '54%' }}
        height="270px"
        image="linear-gradient(160deg, rgba(217,119,6,0.2), rgba(5,7,12,0.36)), url(https://images.unsplash.com/photo-1586899028174-e7098604235b?auto=format&fit=crop&w=900&q=80)"
        label="Family Night"
      />
      <Box
        position="absolute"
        right={{ base: '18px', md: '70px' }}
        bottom={{ base: '44px', md: '70px' }}
        rounded="3xl"
        bg={floatingCardBg}
        color="#111827"
        p={5}
        maxW="270px"
        boxShadow="2xl"
      >
        <Text fontSize="sm" fontWeight="bold" color="blackAlpha.600">
          Featured premiere
        </Text>
        <Heading as="h2" mt={2} fontSize="2xl" fontWeight="black">
          Midnight Signal
        </Heading>
        <Text mt={3} fontSize="sm" lineHeight="6" color="blackAlpha.700">
          A new sci-fi thriller with 4K playback, subtitles, downloads, and
          weekly episode drops.
        </Text>
      </Box>
    </Box>
  )
}

function Artwork({
  image,
  label,
  ...props
}: {
  image: string
  label: string
} & BoxProps) {
  const borderColor = useColorModeValue('#f6f8fb', '#0b0d12')

  return (
    <Box
      position="absolute"
      overflow="hidden"
      rounded="32px"
      bgImage={image}
      bgSize="cover"
      bgPosition="center"
      boxShadow="2xl"
      border="8px solid"
      borderColor={borderColor}
      {...props}
    >
      <Flex
        position="absolute"
        left={4}
        right={4}
        bottom={4}
        align="center"
        justify="space-between"
        rounded="full"
        bg="rgba(255,255,255,0.9)"
        color="#111827"
        px={4}
        py={3}
        fontSize="sm"
        fontWeight="bold"
      >
        <Text>{label}</Text>
        <Text color="#e11d48">Play</Text>
      </Flex>
    </Box>
  )
}

function CollectionCard({
  title,
  count,
  color,
  image,
}: {
  title: string
  count: string
  color: string
  image: string
}) {
  return (
    <Box
      minH="250px"
      rounded="3xl"
      overflow="hidden"
      bgImage={image}
      bgSize="cover"
      bgPosition="center"
      position="relative"
    >
      <Box position="absolute" inset="0" bg={`linear-gradient(180deg, transparent, ${color})`} opacity={0.72} />
      <Box position="absolute" left={6} right={6} bottom={6}>
        <Text fontSize="sm" color="whiteAlpha.800">
          {count}
        </Text>
        <Heading as="h3" mt={1} fontSize="2xl" fontWeight="black">
          {title}
        </Heading>
      </Box>
    </Box>
  )
}

export default Landing
