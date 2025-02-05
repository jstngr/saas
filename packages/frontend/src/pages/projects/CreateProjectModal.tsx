import { useState } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { api } from "../../utils/api";
import { useAsyncAction } from "../../hooks/useAsyncAction";

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProjectModal({
  opened,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [budget, setBudget] = useState<number | undefined>();

  const { execute: createProject, loading } = useAsyncAction(
    async () => {
      if (!name || !startDate || !deadline || !budget) {
        notifications.show({
          title: "Error",
          message: "Please fill in all fields",
          color: "red",
        });
        return;
      }

      if (startDate > deadline) {
        notifications.show({
          title: "Error",
          message: "Start date must be before deadline",
          color: "red",
        });
        return;
      }

      await api.post("/projects", {
        name,
        startDate,
        deadline,
        budget,
      });
    },
    {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Project created successfully",
          color: "green",
        });
        onSuccess();
        handleClose();
      },
    }
  );

  const handleClose = () => {
    setName("");
    setStartDate(null);
    setDeadline(null);
    setBudget(undefined);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New Project"
      size="md"
    >
      <Stack gap="md">
        <TextInput
          label="Project Name"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <DateInput
          label="Start Date"
          placeholder="Select start date"
          value={startDate}
          onChange={setStartDate}
          required
        />

        <DateInput
          label="Deadline"
          placeholder="Select deadline"
          value={deadline}
          onChange={setDeadline}
          minDate={startDate || undefined}
          required
        />

        <NumberInput
          label="Budget"
          placeholder="Enter project budget"
          value={budget}
          onChange={(value) =>
            setBudget(typeof value === "number" ? value : undefined)
          }
          min={0}
          required
          hideControls
          prefix="$ "
          thousandSeparator=","
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={createProject}>
            Create Project
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
