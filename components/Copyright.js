import { Box, Text } from "@chakra-ui/react";

function Copyright() {
  return (
    <Box sx={{ bottom: 0, left: 0, right: 0 }}>
      <Box sx={{ paddingBottom: "1rem", textAlign: "center" }}>
        <Text>
          {"Source on "}{" "}
          <a
            target="_blank"
            style={{textDecoration : "underline"}}
            rel="noreferrer"
            href="https://github.com/jameshu15869/Marvelier"
          >
            GitHub{" "}
          </a>
          {new Date().getFullYear()}
          {"."}
        </Text>
      </Box>
    </Box>
  );
}

export default Copyright;
