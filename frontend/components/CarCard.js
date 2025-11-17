import { Box, Image, Heading, Text, Button, Stack, Badge, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { apiFetch } from "../lib/api";

export default function CarCard({ car, onBooked }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const toast = useToast();

  async function book() {
    // Client-side validation
    if (!startDate || !endDate) {
      toast({ id: `booking-missing-${car._id || car.id}`, title: "Please select start and end dates", status: "warning" });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast({ id: `booking-invalid-${car._id || car.id}`, title: "Invalid dates", status: "error" });
      return;
    }

    // Prevent same-day end date — require end > start
    if (end.getTime() <= start.getTime()) {
      toast({ id: `booking-range-${car._id || car.id}`, title: "End date must be after start date", status: "error" });
      return;
    }

    try {
      await apiFetch(`/api/bookings`, {
        method: "POST",
        body: JSON.stringify({ carId: car._id || car.id, startDate, endDate }),
      });
      toast({ id: `booking-success-${car._id || car.id}-${startDate}-${endDate}`, title: "Booked", status: "success", duration: 3000 });
      onClose();
      if (onBooked) onBooked();
    } catch (err) {
      toast({ id: `booking-error-${car._id || car.id}`, title: "Error", description: err.message, status: "error", duration: 4000 });
    }
  }

  const isBookingValid = useMemo(() => {
    if (!startDate || !endDate) return false;
    const s = new Date(startDate);
    const e = new Date(endDate);
    return !isNaN(s.getTime()) && !isNaN(e.getTime()) && e.getTime() > s.getTime();
  }, [startDate, endDate]);

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
      <Image src={car.image || car.img || "/car-placeholder.svg"} alt={car.model || car.name} objectFit="cover" h="160px" w="100%" />
      <Box p={4}>
        <Stack spacing={2}>
          <Heading size="md">{car.model || car.name}</Heading>
          <Text color="gray.600">{car.pricePerDay ? `$${car.pricePerDay}/day` : car.price || ""}</Text>
          <Text fontSize="sm" color="gray.500">{car.type ? car.type + ' • ' : ''}{car.location}</Text>
          <Stack direction="row" spacing={3} align="center">
            <Badge colorScheme={car.availability ? 'green' : 'red'}>{car.availability ? 'Available' : 'Booked'}</Badge>
            {car.pricePerDay && (<Badge colorScheme="purple">${car.pricePerDay}/day</Badge>)}
          </Stack>
          <Button mt={3} colorScheme="teal" size="sm" width="full" onClick={onOpen} isDisabled={!car.availability}>
            Book now
          </Button>
        </Stack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book {car.model || car.name}</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Start date</FormLabel>
              <Input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>End date</FormLabel>
              <Input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="teal" onClick={book}>Confirm Booking</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
