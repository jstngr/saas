import { useState } from "react";
import { Modal, TextInput, Button, Stack, Group, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { api } from "../../utils/api";
import { ProjectMemberRole } from "../../types/project";

interface Project {
  id: string;
  name: string;
}

interface InviteMemberModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: Project | null;
}

export function InviteMemberModal({
  opened,
  onClose,
  onSuccess,
  project,
}: InviteMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(ProjectMemberRole.COLLABORATOR);

  const handleSubmit = async () => {
    if (!project) return;

    if (!email || !role) {
      notifications.show({
        title: "Error",
        message: "Please fill in all fields",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post(`/projects/${project.id}/members`, {
        email,
        role,
      });
      notifications.show({
        title: "Success",
        message: "Invitation sent successfully",
        color: "green",
      });
      onSuccess();
      handleClose();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to send invitation",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setRole(ProjectMemberRole.COLLABORATOR);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={`Invite Member to ${project?.name || "Project"}`}
      size="md"
    >
      <Stack spacing="md">
        <TextInput
          label="Email Address"
          placeholder="Enter member's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Select
          label="Role"
          placeholder="Select member role"
          value={role}
          onChange={(value) => setRole(value || ProjectMemberRole.COLLABORATOR)}
          data={[
            {
              value: ProjectMemberRole.COLLABORATOR,
              label: "Collaborator",
            },
            {
              value: ProjectMemberRole.COLLABORATOR_RESTRICTED,
              label: "Collaborator (Restricted)",
            },
            {
              value: ProjectMemberRole.CLIENT_READ,
              label: "Client (Read Only)",
            },
            {
              value: ProjectMemberRole.CLIENT_READ_WRITE,
              label: "Client (Read & Write)",
            },
          ]}
          required
        />

        <Group position="right" mt="md">
          <Button variant="light" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSubmit}>
            Send Invitation
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
