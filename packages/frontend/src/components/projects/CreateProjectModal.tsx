import { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Group,
  NumberInput,
} from "@mantine/core";
// import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { formatDateForInput } from "../../utils/date";

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
  onCreateProject: (project: {
    name: string;
    startDate: string;
    deadline: string;
    budget: number;
  }) => Promise<void>;
}

export function CreateProjectModal({
  opened,
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [budget, setBudget] = useState<number>(0);

  const handleSubmit = async () => {
    if (!name) {
      notifications.show({
        title: "Error",
        message: "Please enter a project name",
        color: "red",
      });
      return;
    }

    if (!startDate) {
      notifications.show({
        title: "Error",
        message: "Please select a start date",
        color: "red",
      });
      return;
    }

    if (!deadline) {
      notifications.show({
        title: "Error",
        message: "Please select a deadline",
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

    if (budget <= 0) {
      notifications.show({
        title: "Error",
        message: "Please enter a valid budget",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      await onCreateProject({
        name,
        startDate: formatDateForInput(startDate),
        deadline: formatDateForInput(deadline),
        budget,
      });
      onClose();
      setName("");
      setStartDate(null);
      setDeadline(null);
      setBudget(0);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create project",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create New Project"
      size="md"
    >
      <Stack>
        <TextInput
          label="Project Name"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {/* <DateInput
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
          required
          minDate={startDate || undefined}
        /> */}
        <NumberInput
          label="Budget"
          placeholder="Enter project budget"
          value={budget}
          onChange={(value: string | number) =>
            setBudget(typeof value === "number" ? value : 0)
          }
          required
          min={0}
          decimalScale={2}
          prefix="$ "
          thousandSeparator=","
        />
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSubmit}>
            Create Project
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
