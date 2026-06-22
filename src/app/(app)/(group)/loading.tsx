import { Box, LoadingOverlay } from "@mantine/core";

export default function Loading() {
  return (
    <Box pos="relative" style={{ width: "100%", height: "100%" }}>
      <LoadingOverlay visible={true} style={{ zIndex: 1 }} />
    </Box>
  );
}
