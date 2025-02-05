import { Box, Progress, Text, Group, Stack } from "@mantine/core";
import { IconCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

interface PasswordStrengthProps {
  password: string;
  userInputs?: string[]; // Additional context like email, name etc.
}

export function PasswordStrength({
  password,
  userInputs = [],
}: PasswordStrengthProps) {
  const requirements = [
    { label: "Includes at least 8 characters", meets: password.length >= 8 },
    { label: "Includes uppercase letter", meets: /[A-Z]/.test(password) },
    { label: "Includes lowercase letter", meets: /[a-z]/.test(password) },
    { label: "Includes number", meets: /[0-9]/.test(password) },
    {
      label: "Includes special character (@$!%*?&#)",
      meets: /[@$!%*?&#]/.test(password),
    },
  ];

  const result = zxcvbn(password, userInputs);
  const score = result.score; // 0-4
  const feedback = result.feedback;

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = ["red", "orange", "yellow", "lime", "green"];

  const checks = requirements.map((requirement, index) => (
    <Group key={index} gap={7} mt={5}>
      {requirement.meets ? (
        <IconCheck size={14} stroke={1.5} color="green" />
      ) : (
        <IconX size={14} stroke={1.5} color="red" />
      )}
      <Text size="xs" c={requirement.meets ? "dimmed" : "red"}>
        {requirement.label}
      </Text>
    </Group>
  ));

  return (
    <Stack gap="xs">
      <Progress
        value={(score + 1) * 20}
        color={strengthColors[score]}
        size="sm"
        radius="xl"
      />
      <Group gap="lg" align="baseline">
        <Text size="sm" fw={500} c={strengthColors[score]}>
          {strengthLabels[score]}
        </Text>

        {feedback.warning && (
          <>
            <Text size="xs" c={strengthColors[score]}>
              -
            </Text>
            <Text size="xs" c={strengthColors[score]}>
              {feedback.warning}
            </Text>
          </>
        )}
      </Group>
      <Stack gap="0">{checks}</Stack>
    </Stack>
  );
}
