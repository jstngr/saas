import { Center, Loader } from "@mantine/core";

export function LoadingOverlay() {
  return (
    <Center h="100vh">
      <Loader size="lg" />
    </Center>
  );
}
