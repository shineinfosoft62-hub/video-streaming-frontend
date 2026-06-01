import { Box, Drawer, DrawerContent, DrawerOverlay, Flex, useDisclosure } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'

function DashboardLayout() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <Flex minH="100vh" bg="#0f121b" color="white">
      <Sidebar display={{ base: 'none', lg: 'block' }} position="sticky" top="0" h="100vh" />

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#090b10">
          <Sidebar h="100vh" onNavigate={onClose} />
        </DrawerContent>
      </Drawer>

      <Flex direction="column" flex="1" minW={0}>
        <Header onOpenSidebar={onOpen} />
        <Box as="main" flex="1" px={{ base: 4, md: 6 }} py={{ base: 5, md: 7 }}>
          <Outlet />
        </Box>
        <Footer />
      </Flex>
    </Flex>
  )
}

export default DashboardLayout
