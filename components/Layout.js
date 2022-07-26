import React from "react";

import { Box, Container } from "@chakra-ui/react";
import Navbar from "./Navbar.js";

import layoutStyles from "../styles/Layout.module.css";
import Copyright from "./Copyright.js";
import Head from "next/head.js";

function Layout(props) {
  return (
    <div className={layoutStyles.container}>
      <Head>
        <title>Marvelier</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Container
        maxWidth={{
          base: "container.sm",
          md: "container.md",
          lg: "container.lg",
          xl: "container.xl",
        }}
      >
        {props.children}
        <Copyright />
      </Container>
    </div>
  );
}

export default Layout;
