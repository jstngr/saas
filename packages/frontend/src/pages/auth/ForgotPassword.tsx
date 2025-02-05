import {
  Anchor,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./auth.module.css";
import Logo from "../../assets/images/Logo.png";

export function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async ({ email }: { email: string }) => {
    try {
      await forgotPassword(email);
      notifications.show({
        title: "Success",
        message:
          "If an account exists, you will receive a password reset email",
        color: "green",
      });
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <Card shadow="sm" maw="380px" w="100%">
      <Stack align="center" gap="lg">
        <Group gap="xs" align="center" py="xl">
          <Image src={Logo} className={styles.logo} />
          <Text className={styles.saas} lh="38px">
            saas
          </Text>
        </Group>

        <Stack gap="xs">
          <Title order={2} ta="center">
            Forgot your password?
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Enter your email to get a reset link.
          </Text>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            {...form.getInputProps("email")}
          />

          <Button type="submit" fullWidth>
            Send reset link
          </Button>
        </form>

        <Group gap="xs" align="center">
          <Text size="sm">Remember your password?</Text>
          <Anchor size="sm" ta="center" component={Link} to="/auth/login">
            Log in
          </Anchor>
        </Group>
      </Stack>
    </Card>
  );
}
