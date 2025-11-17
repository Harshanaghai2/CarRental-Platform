import { Box, Container, Heading, Text, VStack, Button } from "@chakra-ui/react";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  async function load() {
    try {
      const data = await apiFetch('/api/bookings/my-bookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <Box>
      <Header />
      <Container maxW="container.lg" py={12}>
        <Heading mb={4}>My Bookings</Heading>
        {bookings.length === 0 ? (
          <Text color="gray.600">You have no bookings yet.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {bookings.map(b => (
              <Box key={b._id} p={4} borderWidth="1px" borderRadius="md" bg="white">
                <Heading size="sm">{b.carId?.model || 'Unknown Car'}</Heading>
                <Text>From: {new Date(b.startDate).toLocaleDateString()} To: {new Date(b.endDate).toLocaleDateString()}</Text>
                <Text>Status: {b.status}</Text>
                <Button mt={2} onClick={load} size="sm">Refresh</Button>
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
