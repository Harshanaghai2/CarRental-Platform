import Link from "next/link";
import { useEffect, useState } from "react";
import { Flex, Box, HStack, Button, Spacer, Container, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setUser(u);
    } catch (e) {
      setUser(null);
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <Box as="header" bg="white" borderBottomWidth="1px" boxShadow="sm">
      <Container maxW="container.lg">
        <Flex py={4} align="center">
          <Box fontWeight="extrabold" fontSize="lg">CarRental</Box>
          <Spacer />
          <HStack spacing={4}>
            <Link href="/" passHref>
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/cars" passHref>
              <Button variant="ghost">Cars</Button>
            </Link>
            <Link href="/bookings" passHref>
              <Button variant="ghost">Bookings</Button>
            </Link>
            {user ? (
              <Menu>
                <MenuButton as={Button} colorScheme="teal">
                  {user.name || 'Account'}
                </MenuButton>
                <MenuList>
                  {user.role === 'admin' && (
                    <MenuItem as="a" href="/admin">Admin</MenuItem>
                  )}
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack>
                <Link href="/signup" passHref>
                  <Button variant="ghost">Sign up</Button>
                </Link>
                <Link href="/login" passHref>
                  <Button colorScheme="teal">Sign in</Button>
                </Link>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
