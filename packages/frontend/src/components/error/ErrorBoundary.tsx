import React, { Component, ErrorInfo } from "react";
import { Container, Paper, Title, Text, Button, Stack } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // You could send this to your error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container size="sm">
          <Paper radius="md" p="xl" withBorder>
            <Stack align="center" gap={20}>
              <IconAlertTriangle size={50} stroke={1.5} color="red" />
              <Title order={2}>Something went wrong</Title>
              <Text ta="center" c="dimmed">
                We apologize for the inconvenience. Please try refreshing the
                page or contact support if the problem persists.
              </Text>
              {process.env.NODE_ENV === "development" && (
                <Text
                  size="sm"
                  c="red"
                  style={{ maxWidth: "100%", overflow: "auto" }}
                >
                  {this.state.error?.toString()}
                </Text>
              )}
              <Button onClick={this.handleReset}>Return to Home</Button>
            </Stack>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}
