import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function SeriesBox({ series, ...props }) {
  const borderColor = useColorModeValue("purple.200", "purple.600");
  const thumbnailUrl =
    series.thumbnail.path + "/portrait_medium." + series.thumbnail.extension;
  return (
    <Link href={"/series/" + series.id} cursor="pointer">
      <Box
        border="6px solid"
        borderColor={borderColor}
        borderRadius="6px"
        sx={{ display: "flex" }}
        height={150}
        padding="6px"
        cursor="pointer"
      >
        <Image
          src={thumbnailUrl}
          width="100px"
          height="150px"
          style={{ borderRadius: "8px" }}
        ></Image>
        <Text fontSize="md" width="100%" textAlign="center">
          {series.title}
        </Text>
      </Box>
    </Link>
  );
}

export default SeriesBox;
