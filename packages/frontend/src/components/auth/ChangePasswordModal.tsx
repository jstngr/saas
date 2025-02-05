import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../context/AuthContext";
import { PasswordStrength } from "./PasswordStrength";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  opened,
  onClose,
}: ChangePasswordModalProps) {
  const { changePassword } = useAuth();
  const form = useForm<ChangePasswordForm>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      currentPassword: (value) =>
        value.length < 8 ? "Password must be at least 8 characters" : null,
      newPassword: (value) => {
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must include uppercase letter";
        if (!/[a-z]/.test(value))
          return "Password must include lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must include number";
        if (!/[^A-Za-z0-9]/.test(value))
          return "Password must include special character";
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = async (values: ChangePasswordForm) => {
    try {
      await changePassword(values.currentPassword, values.newPassword);
      notifications.show({
        title: "Success",
        message: "Password changed successfully",
        color: "green",
      });
      form.reset();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to change password",
        color: "red",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Change Password" size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Text size="sm" c="dimmed">
            Please enter your current password and choose a new one.
          </Text>

          <PasswordInput
            label="Current Password"
            placeholder="Your current password"
            required
            {...form.getInputProps("currentPassword")}
          />

          <PasswordInput
            label="New Password"
            placeholder="Your new password"
            required
            {...form.getInputProps("newPassword")}
          />

          <PasswordStrength password={form.values.newPassword} />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            required
            {...form.getInputProps("confirmPassword")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Change Password</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
