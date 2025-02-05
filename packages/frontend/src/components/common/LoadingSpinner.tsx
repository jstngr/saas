import { Loader } from "@mantine/core";

export const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      minHeight: "200px",
    }}
  >
    <Loader size="xl" variant="dots" />
  </div>
);
