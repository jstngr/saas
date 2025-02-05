import {
  Anchor,
  Button,
  Card,
  Center,
  Group,
  Image,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { PasswordStrength } from "../../components/auth/PasswordStrength";
import { useAuth } from "../../context/AuthContext";
import { RegisterCredentials } from "../../types/auth";
import styles from "./auth.module.css";
import Logo from "../../assets/images/Logo.png";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterCredentials>({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => {
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must include uppercase letter";
        if (!/[a-z]/.test(value))
          return "Password must include lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must include number";
        if (!/[@$!%*?&#]/.test(value))
          return "Password must include special character (@$!%*?&#)";
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = async (values: RegisterCredentials) => {
    try {
      await register(values);
      notifications.show({
        title: "Registration Successful",
        message: "Please login using your email and password",
        //message:
        //  "A verification email has been sent to your email address. Please check your inbox and verify your email to continue.",
        color: "green",
      });
      navigate("/auth/login", { state: { email: values.email } });
    } catch (error: any) {
      notifications.show({
        title: "Registration Failed",
        message:
          error.response?.data?.message ||
          "An error occurred during registration",
        color: "red",
      });
    }
  };

  return (
    <Center h="100%" className={styles.container}>
      <Card shadow="sm" maw="380px" w="100%">
        <Stack align="center" gap="lg">
          <Group gap="xs" align="center" py="xl">
            <Image src={Logo} className={styles.logo} />
            <Text className={styles.saas} lh="38px">
              saas
            </Text>
          </Group>

          <Title order={2}>Create an account</Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="First Name"
                placeholder="Your first name"
                {...form.getInputProps("firstname")}
              />

              <TextInput
                label="Last Name"
                placeholder="Your last name"
                {...form.getInputProps("lastname")}
              />

              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                {...form.getInputProps("email")}
              />

              <Stack gap="xs">
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  description="Must include: 8+ characters, uppercase, lowercase, number, and special character (@$!%*?&#)"
                  required
                  {...form.getInputProps("password")}
                />

                <PasswordStrength password={form.values.password} />
              </Stack>

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                {...form.getInputProps("confirmPassword")}
              />

              <Button type="submit" fullWidth>
                Register
              </Button>
            </Stack>
          </form>

          <Group gap="xs" align="center">
            <Text size="sm">Already have an account?</Text>
            <Anchor size="sm" ta="center" component={Link} to="/auth/login">
              Log in
            </Anchor>
          </Group>

          <Text size="xs" c="dimmed" ta="center" mt="md">
            By continuing, you agree to our TERMS OF SERVICE and to receive
            relevant marketing emails.
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}
