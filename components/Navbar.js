import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
  Icon,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

import { MdHome } from "react-icons/md";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import Link from "next/link";

var crypto = require("crypto");

function Navbar() {
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow(!show);

  const { colorMode, toggleColorMode } = useColorMode();

  const primaryTextColor = useColorModeValue("black", "white");
  const navbarColor = useColorModeValue("purple.200", "purple.600");

  return (
    <Flex
      backgroundColor={navbarColor}
      mb={8}
      p={5}
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
    >
      <Box
        w="300px"
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Link href="/">
          <IconButton
            fontSize="28px"
            colorScheme="gray"
            size="md"
            icon={<MdHome />}
          />
        </Link>
        <Heading paddingLeft="12px" fontSize="2xl">
          Marvelier
        </Heading>
      </Box>

      <Box display={{ base: "block", md: "none" }} onClick={toggleMenu}>
        {show ? <CloseIcon /> : <HamburgerIcon />}
      </Box>

      <Box
        display={{ base: show ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Flex
          align="center"
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "row", "row", "row"]}
          pt={[4, 4, 0, 0]}
          paddingRight={{ base: 0, md: "5px" }}
        >
          <MenuItem to="/about" color={primaryTextColor}>
            About
          </MenuItem>
          <MenuItem to="/characters" color={primaryTextColor}>
            Characters
          </MenuItem>
          <MenuItem to="/comics" color={primaryTextColor}>
            Comics
          </MenuItem>
          <MenuItem to="/creators" color={primaryTextColor}>
            Creators
          </MenuItem>
          <MenuItem to="/series" color={primaryTextColor} isLast>
            Series
          </MenuItem>
          <Button
            onClick={toggleColorMode}
            marginTop={{ base: "10px", sm: 0 }}
            marginLeft={{ base: 0, md: "1.5rem" }}
            color={primaryTextColor}
          >
            {colorMode === "light" ? (
              <Icon as={BsFillMoonFill} />
            ) : (
              <Icon as={BsFillSunFill} />
            )}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

const MenuItem = ({ isLast, to, children, color }) => {
  return (
    <Text
      marginBottom={{ base: isLast ? 0 : 8, sm: 0 }}
      marginRight={{ base: 0, sm: isLast ? 0 : 8 }}
      display="block"
      color={color}
    >
      <Link href={to}>{children}</Link>
    </Text>
  );
};

export default Navbar;
