import { useState } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Switch,
  Divider,
  Alert,
} from "@mantine/core";
import { IconShieldLock, IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { ChangePasswordModal } from "../../components/auth/ChangePasswordModal";

export const SecuritySettings = () => {
  const { user } = useAuth();
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <Container size="md">
      <Paper radius="md" p="xl" withBorder>
        <Stack gap="xl">
          <Title order={2}>Security Settings</Title>

          <div>
            <Title order={3} size="h4" mb="md">
              Password
            </Title>
            <Group justify="space-between">
              <div>
                <Text>
                  Change your password regularly to keep your account secure
                </Text>
                <Text size="sm" color="dimmed">
                  Last changed: Never
                </Text>
              </div>
              <Button onClick={() => setChangePasswordModalOpen(true)}>
                Change Password
              </Button>
            </Group>
          </div>

          <Divider />

          <div>
            <Title order={3} size="h4" mb="md">
              Two-Factor Authentication
            </Title>
            <Group justify="apart">
              <div>
                <Text>Add an extra layer of security to your account</Text>
                <Text size="sm" color="dimmed">
                  {twoFactorEnabled
                    ? "Two-factor authentication is enabled"
                    : "Two-factor authentication is disabled"}
                </Text>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onChange={(event) =>
                  setTwoFactorEnabled(event.currentTarget.checked)
                }
                size="lg"
              />
            </Group>
          </div>

          <Divider />

          <div>
            <Title order={3} size="h4" mb="md">
              Active Sessions
            </Title>
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
              You're currently logged in on 1 device
            </Alert>
            <Button variant="subtle" color="red" mt="md">
              Log Out of All Devices
            </Button>
          </div>

          <Divider />

          <div>
            <Title order={3} size="h4" c="red" mb="md">
              Danger Zone
            </Title>
            <Text color="dimmed" mb="md">
              Once you delete your account, there is no going back. Please be
              certain.
            </Text>
            <Button color="red" variant="outline">
              Delete Account
            </Button>
          </div>
        </Stack>
      </Paper>

      <ChangePasswordModal
        opened={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </Container>
  );
};
