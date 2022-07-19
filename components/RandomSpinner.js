import React, { useEffect, useState } from "react";

import { Box, Spinner, Text } from "@chakra-ui/react";

function RandomSpinner() {
  const options = [
    "Battling the Sinister Six...",
    "Facing Off Against Thanos...",
    "Traveling Through the Multiverse...",
    "Taking the Super Serum...",
    "Building an Iron Man Suit...",
    "Looking for Wakanda...",
    "Web-Swinging Through New York...",
    "Forging Stormbreaker...",
    "Using the Time Stone...",
    "Teleporting to Asgard...",
  ];

  const [text, setText] = useState("");

  useEffect(() => {
    let index = Math.floor(Math.random() * options.length);
    setText(options[index]);
  }, []);

  return (
    <Box sx={{ textAlign: "center" }}>
      <Spinner color="purple.500" size="xl" marginTop="25%" />
      <Text>{text}</Text>
    </Box>
  );
}

export default RandomSpinner;
