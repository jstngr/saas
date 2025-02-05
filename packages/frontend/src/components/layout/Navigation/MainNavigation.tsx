import {
  ActionIcon,
  AppShellNavbar,
  Avatar,
  Button,
  Divider,
  Group,
  Image,
  NavLink,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconHome2,
  IconUser,
  IconSettings,
  IconSearch,
  IconDots,
  IconArrowLeft,
  IconFolders,
} from "@tabler/icons-react";
import { useState } from "react";
import styles from "./MainNavigation.module.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/Logo.png";

interface IMainNavigationProps {
  toggleNavbar: () => void;
  opened: boolean;
}

export function MainNavigation({ toggleNavbar, opened }: IMainNavigationProps) {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Home", icon: <IconHome2 size={20} />, path: "/" },
    { label: "Projects", icon: <IconFolders size={20} />, path: "/projects" },
    { label: "Profile", icon: <IconUser size={20} />, path: "/profile" },
    {
      label: "Settings",
      icon: <IconSettings size={20} />,
      path: "/settings/security",
    },
  ];

  return (
    <AppShellNavbar p="lg" pr="xs" bg="none" withBorder={false}>
      <Stack gap="lg">
        <Group justify="space-between">
          <Group gap="xs">
            <Image src={Logo} className={styles.logo} />
            <Text className={styles.saas}>saas</Text>
          </Group>
          <ActionIcon
            variant="subtle"
            color="black"
            pr="0"
            onClick={toggleNavbar}
          >
            <IconArrowLeft
              size={18}
              style={{
                transform: opened ? "rotate(-180deg)" : "none",
                transition: "transform 0.2s ease-in-out",
              }}
            />
          </ActionIcon>
        </Group>
        <TextInput
          placeholder="Search"
          leftSection={<IconSearch size={16} />}
          variant="filled"
          styles={{
            input: {
              backgroundColor: "#F0F0F0",
              border: "1px solid var(--mantine-color-gray-3)",
            },
          }}
        />
        <Divider />
        <Stack gap={0}>
          {navigationItems.map((item, index) => (
            <NavLink
              key={item.path}
              label={item.label}
              leftSection={item.icon}
              active={active === index}
              onClick={() => {
                setActive(index);
                navigate(item.path);
              }}
            />
          ))}
        </Stack>
      </Stack>
      <Button
        variant="transparent"
        color="black"
        h="48px"
        p={0}
        styles={{
          inner: {},
          label: {
            flex: "1 0",
          },
        }}
        onClick={() => navigate("/profile")}
      >
        <Group w="100%" flex="1 0 100%" justify="space-between">
          <Group>
            <Avatar size="36px" bg="primary.1" color="primary.9">
              OJ
            </Avatar>
            <Stack gap={0}>
              <Text size="sm">Ola Justinger</Text>
              <Text size="xs" c="dimmed">
                ola@saas.com
              </Text>
            </Stack>
          </Group>
          <IconDots size={16} />
        </Group>
      </Button>
    </AppShellNavbar>
  );
}
