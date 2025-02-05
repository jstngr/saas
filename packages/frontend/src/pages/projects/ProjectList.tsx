import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Button,
  Group,
  Stack,
  Badge,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { IconDots, IconPlus, IconUsers } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { CreateProjectModal } from "./CreateProjectModal";
import { InviteMemberModal } from "./InviteMemberModal";
import { formatDate } from "../../utils/date";
import { api } from "../../utils/api";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { Project } from "../../types/project";

export function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);
  const [
    inviteModalOpened,
    { open: openInviteModal, close: closeInviteModal },
  ] = useDisclosure(false);

  const { execute: fetchProjects, loading } = useAsyncAction(async () => {
    const response = await api.get("/projects");
    setProjects(response.data.data);
  });

  const { execute: deactivateProject } = useAsyncAction(
    async (projectId: string) => {
      await api.put(`/projects/${projectId}/deactivate`);
      await fetchProjects();
    },
    {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Project deactivated successfully",
          color: "green",
        });
      },
    }
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    await fetchProjects();
    closeCreateModal();
  };

  const handleInviteMember = async () => {
    await fetchProjects();
    closeInviteModal();
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="xl" fw={500}>
          Projects
        </Text>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
          Create Project
        </Button>
      </Group>

      {projects?.map((project) => (
        <Card key={project.id} p="lg" shadow="none" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500} size="lg">
              {project.name}
            </Text>
            <Group gap={8}>
              <Badge
                color={project.status === "active" ? "green" : "gray"}
                variant="light"
              >
                {project.status}
              </Badge>
              <Menu position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon>
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconUsers size={16} />}
                    onClick={() => {
                      setSelectedProject(project);
                      openInviteModal();
                    }}
                  >
                    Invite Member
                  </Menu.Item>
                  {project.status === "active" && (
                    <Menu.Item
                      color="red"
                      onClick={() => deactivateProject(project.id)}
                    >
                      Deactivate Project
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          <Group gap="xl">
            <Text size="sm" color="dimmed">
              Start: {formatDate(project.startDate)}
            </Text>
            <Text size="sm" color="dimmed">
              Deadline: {formatDate(project.deadline)}
            </Text>
            <Text size="sm" color="dimmed">
              Budget: ${project.budget.toLocaleString()}
            </Text>
            <Group gap={4}>
              <IconUsers size={16} />
              <Text size="sm">
                {project.members?.length} member
                {project.members?.length !== 1 && "s"}
              </Text>
            </Group>
          </Group>

          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            View Details
          </Button>
        </Card>
      ))}

      <CreateProjectModal
        opened={createModalOpened}
        onClose={closeCreateModal}
        onSuccess={handleCreateProject}
      />

      <InviteMemberModal
        opened={inviteModalOpened}
        onClose={closeInviteModal}
        onSuccess={handleInviteMember}
        project={selectedProject}
      />
    </Stack>
  );
}
