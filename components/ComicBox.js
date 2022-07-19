import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function ComicBox({ comic, ...props }) {
  const borderColor = useColorModeValue("purple.200", "purple.600");
  const thumbnailUrl =
    comic.thumbnail.path + "/portrait_medium." + comic.thumbnail.extension;
  return (
    <Link href={"/comics/" + comic.id} cursor="pointer">
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
          {comic.title}
        </Text>
      </Box>
    </Link>
  );
}

export default ComicBox;
