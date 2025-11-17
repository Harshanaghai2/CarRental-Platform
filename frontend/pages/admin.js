import { Box, Container, Heading, Text, VStack, Button, SimpleGrid, Input, FormControl, FormLabel, HStack, NumberInput, NumberInputField, useToast } from "@chakra-ui/react";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const toast = useToast();

  async function loadBookings() {
    try {
      const data = await apiFetch('/api/bookings/all');
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadCars() {
    try {
      const data = await apiFetch('/api/cars');
      setCars(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{ loadBookings(); loadCars(); }, []);

  async function cancel(id) {
    try {
      await apiFetch(`/api/bookings/cancel/${id}`, { method: 'PUT' });
      loadBookings();
      toast({ id: `booking-cancelled-${id}`, title: 'Booking cancelled', status: 'success' });
    } catch (err) {
      toast({ id: `booking-cancel-error-${id}`, title: 'Error', description: err.message, status: 'error' });
    }
  }

  async function createCar(e) {
    e && e.preventDefault();
    try {
      const payload = { model, type, pricePerDay: Number(pricePerDay), location, image };
      const created = await apiFetch('/api/cars', { method: 'POST', body: JSON.stringify(payload) });
      setModel(''); setType(''); setPricePerDay(0); setLocation(''); setImage('');
      toast({ id: `car-created-${created._id || created.id}`, title: 'Car created', status: 'success' });
      loadCars();
    } catch (err) {
      toast({ id: `car-create-error-${model}`, title: 'Create failed', description: err.message, status: 'error' });
    }
  }

  async function deleteCar(id) {
    try {
      await apiFetch(`/api/cars/${id}`, { method: 'DELETE' });
      toast({ id: `car-deleted-${id}`, title: 'Car deleted', status: 'success' });
      loadCars();
    } catch (err) {
      toast({ id: `car-delete-error-${id}`, title: 'Delete failed', description: err.message, status: 'error' });
    }
  }

  return (
    <Box>
      <Header />
      <Container maxW="container.lg" py={12}>
        <Heading mb={4}>Admin Dashboard</Heading>

        <Box mb={8} p={6} bg="white" borderRadius="md" borderWidth="1px">
          <Heading size="md" mb={4}>Create a new car</Heading>
          <form onSubmit={createCar}>
            <SimpleGrid columns={[1,2]} spacing={4}>
              <FormControl>
                <FormLabel>Model</FormLabel>
                <Input value={model} onChange={(e)=>setModel(e.target.value)} placeholder="Toyota Corolla" />
              </FormControl>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Sedan / SUV" />
              </FormControl>
              <FormControl>
                <FormLabel>Price / day</FormLabel>
                <NumberInput min={0} value={pricePerDay} onChange={(v)=>setPricePerDay(v)}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="City" />
              </FormControl>
              <FormControl gridColumn="1/ -1">
                <FormLabel>Image URL (optional)</FormLabel>
                <Input value={image} onChange={(e)=>setImage(e.target.value)} placeholder="/car-placeholder.svg or https://..." />
              </FormControl>
            </SimpleGrid>
            <HStack mt={4}>
              <Button colorScheme="teal" type="submit">Create Car</Button>
            </HStack>
          </form>
        </Box>

        <Heading size="lg" mb={4}>Bookings</Heading>
        {bookings.length === 0 ? (
          <Text>No bookings found</Text>
        ) : (
          <VStack spacing={4} align="stretch" mb={8}>
            {bookings.map(b => (
              <Box key={b._id} p={4} borderWidth="1px" borderRadius="md" bg="white">
                <Heading size="sm">{b.carId?.model || 'Unknown Car'}</Heading>
                <Text>Customer: {b.userId?.name || 'Unknown'}</Text>
                <Text>From: {new Date(b.startDate).toLocaleDateString()} To: {new Date(b.endDate).toLocaleDateString()}</Text>
                <Text>Status: {b.status}</Text>
                {b.status === 'booked' && (
                  <Button mt={2} colorScheme="red" onClick={()=>cancel(b._id)}>Cancel</Button>
                )}
              </Box>
            ))}
          </VStack>
        )}

        <Heading size="lg" mb={4}>Cars</Heading>
        {cars.length === 0 ? (
          <Text>No cars found</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {cars.map(c => (
              <Box key={c._id || c.id} p={4} borderWidth="1px" borderRadius="md" bg="white">
                <Heading size="sm">{c.model}</Heading>
                <Text>Type: {c.type || '-'}</Text>
                <Text>Price: ${c.pricePerDay || 0}/day</Text>
                <Text>Location: {c.location || '-'}</Text>
                <HStack mt={2}>
                  <Button colorScheme="red" size="sm" onClick={()=>deleteCar(c._id)}>Delete</Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
