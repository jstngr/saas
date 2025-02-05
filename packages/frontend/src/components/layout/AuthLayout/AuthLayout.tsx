import { AppShell, Box, Center } from "@mantine/core";
import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";

export function AuthLayout() {
  return (
    <AppShell>
      <AppShell.Main>
        <Box h="100%" w="100%" className={styles.mainContainer}>
          <Center p="xs" mih="100%">
            <Outlet />
          </Center>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
