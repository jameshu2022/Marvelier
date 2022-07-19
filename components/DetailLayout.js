import React from "react";

import {
  Box,
  Heading,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";

import RandomSpinner from "./RandomSpinner";

function DetailLayout({ obj, busy, basicInfo, children, ...props }) {
  const linkColor = useColorModeValue("#0000EE", "white");
  const borderColor = useColorModeValue("purple.200", "purple.600");
  return (
    <div className="detailContainer">
      {busy && (
        <Box marginBottom="5rem">
          <RandomSpinner />
        </Box>
      )}
      {!busy && (
        <Box border="6px solid" borderColor={borderColor} borderRadius="8px">
          <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={0}>
            <GridItem colSpan={{ base: 1, md: 3 }}>
              <Heading sx={{ padding: "2px 2px 4px 4px" }}>
                {obj.name == null ? obj.title : obj.name}
                {(obj.name == null && obj.title == null) && obj.fullName}
              </Heading>
            </GridItem>
            <GridItem colSpan={1}>{basicInfo}</GridItem>
            <GridItem>
              <Heading fontSize="3xl">You might like...</Heading>
              <Box sx={{ paddingLeft: "0.5rem" }}>{children}</Box>
            </GridItem>
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default DetailLayout;
