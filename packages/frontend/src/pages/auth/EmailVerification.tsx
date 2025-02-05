import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  PinInput,
  Group,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { notifications } from "@mantine/notifications";

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationCode } = useAuth();
  const email = searchParams.get("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async () => {
    if (verificationCode.length !== 4) {
      notifications.show({
        title: "Error",
        message: "Please enter the complete verification code",
        color: "red",
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmail(verificationCode);
      notifications.show({
        title: "Success",
        message: "Email verified successfully",
        color: "green",
      });
      navigate("/login");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Verification failed",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      notifications.show({
        title: "Error",
        message: "Email address is missing",
        color: "red",
      });
      return;
    }

    try {
      await resendVerificationCode(email);
      notifications.show({
        title: "Success",
        message: "A new verification code has been sent to your email",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to resend code",
        color: "red",
      });
    }
  };

  return (
    <Container size="sm">
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" gap="lg">
          <Title order={2}>Verify Your Email</Title>
          <Text ta="center" c="dimmed">
            We've sent a verification code to your email address. Please enter
            it below:
          </Text>

          <PinInput
            length={4}
            size="xl"
            value={verificationCode}
            onChange={setVerificationCode}
            type="number"
            placeholder=""
          />

          <Group>
            <Button loading={isLoading} onClick={handleVerification}>
              Verify Email
            </Button>
            <Button variant="light" onClick={handleResendCode}>
              Resend Code
            </Button>
          </Group>

          <Text size="sm" c="dimmed">
            Didn't receive the code? Check your spam folder or click resend.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
