import Link from "next/link";
import { Box, Heading, Text, Button, Container, Stack, Image } from "@chakra-ui/react";
import Header from "../components/Header";

export default function Home() {
  return (
    <Box>
      <Header />
      <Box bgGradient="linear(to-r, teal.50, white)" py={20}>
        <Container maxW="container.lg">
          <Stack direction={["column", "row"]} spacing={8} align="center">
            <Box flex="1">
              <Heading as="h1" size="2xl" mb={4}>Rent the perfect car for your trip</Heading>
              <Text fontSize="lg" color="gray.600" mb={6}>Fast booking, competitive prices, and a curated fleet across major cities.</Text>
              <Link href="/cars" passHref>
                <Button colorScheme="teal" size="lg">Browse Cars</Button>
              </Link>
            </Box>
            <Box flex="1" textAlign="center">
              <Image src="/car-placeholder.svg" alt="hero car" maxW="520px" mx="auto" borderRadius="md" boxShadow="lg" />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
