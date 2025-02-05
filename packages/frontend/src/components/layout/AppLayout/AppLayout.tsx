import { AppShell, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { MainNavigation } from "../Navigation/MainNavigation";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  const [opened, { toggle: toggleNavbar }] = useDisclosure(true);

  return (
    <AppShell
      navbar={{ width: 276, breakpoint: "0", collapsed: { mobile: !opened } }}
      padding="xs"
    >
      <MainNavigation toggleNavbar={toggleNavbar} opened={opened} />
      <AppShell.Main>
        <Stack
          className={styles.mainContainer}
          style={{ overflow: "auto" }}
          h="100%"
          w="100%"
          gap="lg"
        >
          <Outlet />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
