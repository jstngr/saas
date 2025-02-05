import {
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { notifications } from "@mantine/notifications";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordForm>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) => {
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
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = async (values: ResetPasswordForm) => {
    if (!token) {
      notifications.show({
        title: "Error",
        message: "Invalid or missing reset token",
        color: "red",
      });
      return;
    }

    try {
      await resetPassword(token, values.password);
      notifications.show({
        title: "Success",
        message: "Password has been reset successfully",
        color: "green",
      });
      navigate("/login");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to reset password. Please try again.",
        color: "red",
      });
    }
  };

  if (!token) {
    return (
      <Container size={420} my={40}>
        <Title ta="center" color="red">
          Invalid Reset Link
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          This password reset link is invalid or has expired.{" "}
          <Link to="/forgot-password">Request a new one</Link>
        </Text>
      </Container>
    );
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Reset your password</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your new password below
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <PasswordInput
              label="New Password"
              placeholder="Your new password"
              required
              {...form.getInputProps("password")}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your new password"
              required
              {...form.getInputProps("confirmPassword")}
            />

            <Button type="submit" fullWidth mt="xl">
              Reset password
            </Button>

            <Text size="sm" ta="center">
              Remember your password? <Link to="/login">Back to login</Link>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
