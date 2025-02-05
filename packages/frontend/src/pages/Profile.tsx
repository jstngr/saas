import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../context/AuthContext";
import BreadCrumbs from "../components/layout/BreadCrumbs/BreadCrumbs";
import { IconUser } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ChangePasswordModal } from "../components/auth/ChangePasswordModal";
import { DeleteAccountModal } from "../components/auth/DeleteAccountModal";

interface ProfileForm {
  firstname: string;
  lastname: string;
  email: string;
}

export function Profile() {
  const { user, logout } = useAuth();
  const [
    changePasswordOpened,
    { open: openChangePassword, close: closeChangePassword },
  ] = useDisclosure(false);
  const [
    deleteAccountOpened,
    { open: openDeleteAccount, close: closeDeleteAccount },
  ] = useDisclosure(false);

  const form = useForm<ProfileForm>({
    initialValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
    },
  });

  const handleSubmit = async (values: ProfileForm) => {
    try {
      // TODO: Implement profile update
      notifications.show({
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update profile",
        color: "red",
      });
    }
  };

  return (
    <Stack gap="lg">
      <BreadCrumbs
        items={[
          { title: "Profile", href: "/profile", icon: <IconUser size={16} /> },
        ]}
      />

      <Container size="md" p={0}>
        <Stack gap="lg">
          <Card withBorder>
            <Group justify="space-between" mb="lg">
              <Stack gap={0}>
                <Title order={4}>Profile Information</Title>
                <Text size="sm" c="dimmed">
                  Update your personal information
                </Text>
              </Stack>
              <Avatar size="xl" radius="xl" color="blue">
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </Avatar>
            </Group>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <Group grow>
                  <TextInput
                    label="First Name"
                    placeholder="Your first name"
                    {...form.getInputProps("firstname")}
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Your last name"
                    {...form.getInputProps("lastname")}
                  />
                </Group>

                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  {...form.getInputProps("email")}
                  disabled
                />

                <Group justify="flex-end">
                  <Button type="submit">Save Changes</Button>
                </Group>
              </Stack>
            </form>
          </Card>

          <Card withBorder>
            <Stack gap={0} mb="lg">
              <Title order={4}>Security</Title>
              <Text size="sm" c="dimmed">
                Manage your password and security settings
              </Text>
            </Stack>

            <Stack>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text fw={500}>Password</Text>
                  <Text size="sm" c="dimmed">
                    Change your password
                  </Text>
                </Stack>
                <Button variant="light" onClick={openChangePassword}>
                  Change Password
                </Button>
              </Group>

              <Divider />

              <Group justify="space-between">
                <Stack gap={0}>
                  <Text fw={500}>Two-Factor Authentication</Text>
                  <Text size="sm" c="dimmed">
                    Add an extra layer of security to your account
                  </Text>
                </Stack>
                <Button variant="light" disabled>
                  Coming Soon
                </Button>
              </Group>

              <Divider />

              <Group justify="space-between">
                <Stack gap={0}>
                  <Text fw={500}>Logout</Text>
                  <Text size="sm" c="dimmed">
                    Sign out of your account
                  </Text>
                </Stack>
                <Button variant="light" color="red" onClick={logout}>
                  Logout
                </Button>
              </Group>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack gap={0} mb="lg">
              <Title order={4} c="red">
                Danger Zone
              </Title>
              <Text size="sm" c="dimmed">
                Irreversible and destructive actions
              </Text>
            </Stack>

            <Group justify="space-between">
              <Stack gap={0}>
                <Text fw={500}>Delete Account</Text>
                <Text size="sm" c="dimmed">
                  Permanently delete your account and all data
                </Text>
              </Stack>
              <Button color="red" variant="light" onClick={openDeleteAccount}>
                Delete Account
              </Button>
            </Group>
          </Card>
        </Stack>
      </Container>

      <ChangePasswordModal
        opened={changePasswordOpened}
        onClose={closeChangePassword}
      />

      <DeleteAccountModal
        opened={deleteAccountOpened}
        onClose={closeDeleteAccount}
      />
    </Stack>
  );
}
