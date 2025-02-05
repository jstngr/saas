import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface DeleteAccountForm {
  confirmation: string;
}

interface DeleteAccountModalProps {
  opened: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({
  opened,
  onClose,
}: DeleteAccountModalProps) {
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();

  const form = useForm<DeleteAccountForm>({
    initialValues: {
      confirmation: "",
    },
    validate: {
      confirmation: (value) =>
        value !== "delete my account"
          ? 'Please type "delete my account" to confirm'
          : null,
    },
  });

  const handleSubmit = async (values: DeleteAccountForm) => {
    try {
      await deleteAccount();
      notifications.show({
        title: "Account Deleted",
        message: "Your account has been permanently deleted",
        color: "blue",
      });
      navigate("/login");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete account",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Delete Account"
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Text size="sm" c="red">
            Warning: This action cannot be undone. Your account and all
            associated data will be permanently deleted.
          </Text>

          <Text size="sm" fw={500}>
            Please type "delete my account" to confirm:
          </Text>

          <TextInput
            placeholder="delete my account"
            required
            {...form.getInputProps("confirmation")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="red">
              Delete Account
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
