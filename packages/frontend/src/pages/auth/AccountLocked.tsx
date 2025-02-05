import { Container, Paper, Title, Text, Button, Stack } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export const AccountLocked = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm">
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" spacing="lg">
          <IconLock size={50} stroke={1.5} color="red" />
          <Title order={2}>Account Temporarily Locked</Title>
          <Text align="center" color="dimmed">
            For your security, we've temporarily locked your account due to
            multiple failed login attempts. Please try again later or reset your
            password.
          </Text>
          <Button onClick={() => navigate("/auth/forgot-password")}>
            Reset Password
          </Button>
          <Button
            variant="subtle"
            onClick={() => navigate("/auth/contact-support")}
          >
            Contact Support
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
