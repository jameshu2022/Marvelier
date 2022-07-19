import React from "react";
import Navbar from "../components/Navbar.js";
import { Container, Heading, Text } from "@chakra-ui/react";

function about() {
  return (
    <div className="page-about">
      <Navbar />
      <Container
        maxWidth={{
          base: "container.sm",
          md: "container.md",
          lg: "container.lg",
          xl: "container.xl",
        }}
      >
        <Heading>About Marvelier</Heading>
        <Text sx={{ paddingTop: "3rem" }}>
          Marvelier stands for Marvel Sommelier. This web app attempts to
          provide recommendations for comics and other Marvel media based on
          your search, like an expert wine sommelier.
        </Text>
        <Text sx={{ paddingTop: "1rem" }}>
          To begin, press Character, Comics, Creators, or Series in the Navbar.
        </Text>
      </Container>
    </div>
  );
}

export default about;
