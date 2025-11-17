import { ChakraProvider, Box } from "@chakra-ui/react";
import "../styles/globals.css";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Box flex="1">
          <Component {...pageProps} />
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;
