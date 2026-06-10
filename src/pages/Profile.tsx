import { Avatar, Box, Divider, Heading, HStack, Icon, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { FiCalendar, FiMail, FiPhone, FiUser } from 'react-icons/fi'
import AppBadge from '../components/common/AppBadge'
import AppLogoutButton from '../components/common/AppLogoutButton'
import { getAuthUser, getAuthUserDisplayName } from '../service/authTokens'

const formatValue = (value?: string) => value || 'Not provided'

const formatDate = (value?: string) => {
  if (!value) {
    return 'Not provided'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function Profile() {
  const user = getAuthUser()
  const displayName = getAuthUserDisplayName(user)
  const cardBg = useColorModeValue('white', 'whiteAlpha.100')
  const cardBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const headingColor = useColorModeValue('#172033', 'white')
  const mutedColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const subtleColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500')
  const detailBg = useColorModeValue('#f7faf9', 'rgba(9, 11, 16, 0.42)')
  const iconBg = useColorModeValue('teal.50', 'whiteAlpha.100')

  const details = [
    { label: 'First name', value: formatValue(user?.firstName), icon: FiUser },
    { label: 'Last name', value: formatValue(user?.lastName), icon: FiUser },
    { label: 'Email address', value: formatValue(user?.email), icon: FiMail },
    { label: 'Phone number', value: formatValue(user?.phone), icon: FiPhone },
    { label: 'Birthdate', value: formatDate(user?.dob), icon: FiCalendar },
  ]

  return (
    <Box maxW="1120px">
      <Box rounded="3xl" overflow="hidden" bg={cardBg} border="1px solid" borderColor={cardBorder}>
        <Box p={{ base: 6, md: 8 }} bg="linear-gradient(135deg, rgba(20,184,166,0.24), rgba(225,29,72,0.16))">
          <AppBadge>User profile</AppBadge>

          <Stack mt={8} direction={{ base: 'column', md: 'row' }} align={{ base: 'flex-start', md: 'center' }} spacing={6}>
            <Avatar
              name={displayName}
              size={{ base: '2xl', md: '2xl' }}
              bg="#14b8a6"
              color="#041311"
              fontWeight="black"
              boxShadow="0 18px 42px rgba(20,184,166,0.22)"
            />
            <Box minW={0} flex="1">
              <Text color={subtleColor} fontWeight="semibold">
                Signed in as
              </Text>
              <Heading as="h1" mt={2} fontSize={{ base: '3xl', md: '5xl' }} lineHeight="1" color={headingColor}>
                {displayName}
              </Heading>
              <Text mt={4} color={mutedColor} lineHeight="7" wordBreak="break-word">
                {formatValue(user?.email)}
              </Text>
            </Box>
          </Stack>
        </Box>

        <Box p={{ base: 6, md: 8 }}>
          <HStack justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={4} flexWrap="wrap">
            <Box>
              <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} color={headingColor}>
                Profile information
              </Heading>
            </Box>
          </HStack>

          <Box mt={6} rounded="2xl" bg={detailBg} border="1px solid" borderColor={cardBorder}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={0}>
              {details.map((detail, index) => (
                <HStack
                  key={detail.label}
                  spacing={4}
                  align="flex-start"
                  p={5}
                  borderBottom="1px solid"
                  borderRight={{ base: '0', md: index % 2 === 0 ? '1px solid' : '0' }}
                  borderColor={cardBorder}
                >
                  <Box display="grid" placeItems="center" boxSize="38px" rounded="full" bg={iconBg} color="#14b8a6" flexShrink={0}>
                    <Icon as={detail.icon} boxSize={4} />
                  </Box>
                  <Box minW={0}>
                    <Text fontSize="sm" color={subtleColor}>
                      {detail.label}
                    </Text>
                    <Text mt={1} fontSize="md" fontWeight="bold" color={headingColor} wordBreak="break-word">
                      {detail.value}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>

          <Divider my={6} borderColor={cardBorder} />
          <AppLogoutButton mode="settings" />
        </Box>
      </Box>
    </Box>
  )
}

export default Profile
