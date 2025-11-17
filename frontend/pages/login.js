import { Box, Container, Heading, Input, Button, VStack, useToast } from "@chakra-ui/react";
import Header from "../components/Header";
import { useState } from "react";
import { apiFetch } from "../lib/api";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();

  async function handleSubmit(e) {
    e && e.preventDefault();
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({ id: `login-success-${email}`, title: "Signed in", status: "success" });
      router.push("/");
    } catch (err) {
      toast({ id: `login-error-${email}`, title: "Login failed", description: err.message, status: "error" });
    }
  }

  return (
    <Box>
      <Header />
      <Container maxW="md" py={12}>
        <Heading mb={6}>Sign in</Heading>
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <Button colorScheme="teal" width="full" type="submit">
            Sign in
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
