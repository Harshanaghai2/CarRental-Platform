import { Box, Container, Heading, Input, Button, VStack, Select, useToast } from "@chakra-ui/react";
import Header from "../components/Header";
import { useState } from "react";
import { apiFetch } from "../lib/api";
import { useRouter } from "next/router";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const toast = useToast();
  const router = useRouter();

  async function handleSubmit(e) {
    e && e.preventDefault();
    try {
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      toast({ id: `signup-success-${email}`, title: "Account created", status: "success" });
      router.push("/login");
    } catch (err) {
      toast({ id: `signup-error-${email}`, title: "Signup failed", description: err.message, status: "error" });
    }
  }

  return (
    <Box>
      <Header />
      <Container maxW="md" py={12}>
        <Heading mb={6}>Create account</Heading>
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <Select value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
          </Select>
          <Button colorScheme="teal" width="full" type="submit">
            Create account
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
