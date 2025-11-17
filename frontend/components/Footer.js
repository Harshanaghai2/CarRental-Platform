import { Box, Container, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" bg="gray.50" borderTopWidth="1px" py={6} mt={12}>
      <Container maxW="container.lg">
        <Text fontSize="sm" color="gray.600">© {new Date().getFullYear()} CarRental</Text>
      </Container>
    </Box>
  );
}
