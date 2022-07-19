import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ListViewProvider } from "../components/ListView";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ListViewProvider>
        <Component {...pageProps} />
      </ListViewProvider>
    </ChakraProvider>
  );
}

export default MyApp;
