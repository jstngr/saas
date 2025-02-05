import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Paper, Title, Text, Stack } from "@mantine/core";
import { IconHourglassHigh } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

export const MagicLinkLanding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithMagicLink } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid magic link");
      return;
    }

    loginWithMagicLink(token)
      .then(() => navigate("/dashboard"))
      .catch((err) => setError(err.message));
  }, [searchParams, loginWithMagicLink, navigate]);

  if (!error) {
    return <LoadingSpinner />;
  }

  return (
    <Container size="sm">
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" spacing="lg">
          <IconHourglassHigh size={50} stroke={1.5} color="red" />
          <Title order={2}>Magic Link Invalid</Title>
          <Text align="center" color="dimmed">
            {error}. Please request a new magic link to log in.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
};
