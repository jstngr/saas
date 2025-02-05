import {
  Anchor,
  Button,
  Card,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Checkbox,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconMailSpark } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/icons/google.svg";
import { API_MESSAGES } from "../../constants/api-messages";
import { useAuth } from "../../context/AuthContext";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { LoginCredentials } from "../../types/auth";
import styles from "./auth.module.css";
import Logo from "../../assets/images/Logo.png";

export function Login() {
  const { login, loginWithGoogle, sendMagicLink } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const savedEmail = localStorage.getItem("rememberedEmail") || "";
  const email = location.state?.email || savedEmail;

  const form = useForm<LoginCredentials & { rememberEmail: boolean }>({
    initialValues: {
      email: email,
      password: "",
      rememberEmail: !!savedEmail,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "Password must be at least 8 characters" : null,
    },
  });

  const { execute: handleLogin, loading } = useAsyncAction(
    async (values: LoginCredentials & { rememberEmail: boolean }) => {
      if (values.rememberEmail) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const { rememberEmail, ...loginValues } = values;
      await login(loginValues);
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    },
    {
      onSuccess: () => {
        notifications.show({
          title: "Welcome back!",
          message: "You have successfully logged in.",
          color: "green",
        });
      },
      onError: (error: any) => {
        console.log("error", error);
        if (error.response) {
          switch (error.response.status) {
            case 401:
              if (
                error.response.data?.message ===
                API_MESSAGES.AUTH.EMAIL_NOT_VERIFIED
              ) {
                notifications.show({
                  title: "Account Not Activated",
                  message:
                    "Your account needs to be activated first. Please click on the link in the email we sent you.",
                  color: "yellow",
                });
              } else if (
                error.response.data?.message ===
                API_MESSAGES.AUTH.ACCOUNT_LOCKED
              ) {
                notifications.show({
                  title: "Account Locked",
                  message: error.response.data?.message,
                  color: "red",
                });
              } else {
                console.log("error.response.data", error.response.data);
                notifications.show({
                  title: "Authentication Failed",
                  message: "Email or password is incorrect.",
                  color: "red",
                });
              }
              break;
            case 500:
              notifications.show({
                title: "Server Error",
                message: API_MESSAGES.GENERIC.SERVER_ERROR,
                color: "red",
              });
              break;
            default:
              notifications.show({
                title: "Error",
                message:
                  error.response.data?.message ||
                  API_MESSAGES.GENERIC.SERVER_ERROR,
                color: "red",
              });
          }
        } else {
          notifications.show({
            title: "Connection Error",
            message: API_MESSAGES.GENERIC.CONNECTION_ERROR,
            color: "red",
          });
        }
      },
    }
  );

  const handleMagicLink = async () => {
    if (!form.values.email) {
      form.setFieldError("email", "Email is required for magic link");
      return;
    }
    try {
      await sendMagicLink(form.values.email);
      notifications.show({
        title: "Success",
        message: "Magic link sent to your email",
        color: "green",
      });
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

        <form onSubmit={form.onSubmit(handleLogin)} className={styles.form}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps("password")}
          />

          <Group justify="space-between">
            <Checkbox
              label="Remember email"
              {...form.getInputProps("rememberEmail", { type: "checkbox" })}
            />
            <Anchor size="sm" component={Link} to="/auth/forgot-password">
              Forgot password?
            </Anchor>
          </Group>

          <Button loading={loading} type="submit" fullWidth>
            Sign in
          </Button>
        </form>

        <Group gap="xs" align="center">
          <Text size="sm">Don't have an account yet?</Text>
          <Anchor size="sm" ta="center" component={Link} to="/auth/register">
            Sign up
          </Anchor>
        </Group>
        <Divider label="Or continue with" labelPosition="center" w="100%" />

        <Stack w="100%" gap="xs">
          <Button
            leftSection={<GoogleIcon />}
            variant="default"
            onClick={loginWithGoogle}
            fullWidth
          >
            Sign in with Google
          </Button>

          <Button
            variant="default"
            onClick={handleMagicLink}
            leftSection={<IconMailSpark size={16} />}
          >
            Sign in with Magic Link
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
