import { Box, Container, SimpleGrid, Heading, Input, HStack, Switch, FormControl, FormLabel, Button, Select, NumberInput, NumberInputField } from "@chakra-ui/react";
import Header from "../components/Header";
import CarCard from "../components/CarCard";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [location, setLocation] = useState("");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCars() {
    setLoading(true);
    try {
      const qs = [];
      if (location) qs.push(`location=${encodeURIComponent(location)}`);
      if (typeFilter) qs.push(`type=${encodeURIComponent(typeFilter)}`);
      if (minPrice) qs.push(`minPrice=${encodeURIComponent(minPrice)}`);
      if (maxPrice) qs.push(`maxPrice=${encodeURIComponent(maxPrice)}`);
      if (availableOnly) qs.push(`available=true`);
      const path = `/api/cars${qs.length ? `?${qs.join("&")}` : ""}`;
      const data = await apiFetch(path);
      setCars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCars(); }, []);

  return (
    <Box>
      <Header />
      <Container maxW="container.lg" py={12}>
        <Heading mb={6}>Available Cars</Heading>

        <HStack mb={6} spacing={4} flexWrap="wrap">
          <Input placeholder="Filter by location" value={location} onChange={(e)=>setLocation(e.target.value)} />
          <Select placeholder="Type" value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)} width="160px">
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Electric">Electric</option>
            <option value="Luxury">Luxury</option>
          </Select>
          <NumberInput min={0} max={10000} value={minPrice} onChange={(v)=>setMinPrice(v)} width="120px">
            <NumberInputField placeholder="Min $" />
          </NumberInput>
          <NumberInput min={0} max={10000} value={maxPrice} onChange={(v)=>setMaxPrice(v)} width="120px">
            <NumberInputField placeholder="Max $" />
          </NumberInput>
          <FormControl display="flex" alignItems="center" width="auto">
            <FormLabel mb="0" mr={2}>Available only</FormLabel>
            <Switch isChecked={availableOnly} onChange={(e)=>setAvailableOnly(e.target.checked)} />
          </FormControl>
          <Button onClick={loadCars} colorScheme="teal">Apply</Button>
        </HStack>

        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {loading ? <div>Loading...</div> : cars.map((car) => (
            <CarCard key={car._id || car.id} car={car} onBooked={loadCars} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
