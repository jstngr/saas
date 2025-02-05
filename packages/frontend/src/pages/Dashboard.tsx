import {
  Card,
  Container,
  Grid,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
  Title,
  Button,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import BreadCrumbs from "../components/layout/BreadCrumbs/BreadCrumbs";
import {
  IconHome2,
  IconMail,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

export function Dashboard() {
  const { user } = useAuth();

  // Example stats - replace with real data
  const stats = [
    {
      title: "Total Emails",
      value: "1,234",
      description: "Last 30 days",
      progress: 75,
    },
    {
      title: "Open Rate",
      value: "52%",
      description: "Above average",
      progress: 52,
    },
    {
      title: "Response Rate",
      value: "27%",
      description: "Below average",
      progress: 27,
    },
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  return (
    <Stack gap="lg">
      <BreadCrumbs
        items={[
          { title: "Home", href: "/", icon: <IconHome2 size={16} /> },
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: <IconMail size={16} />,
          },
        ]}
      />

      <Container size="md" p={0}>
        <Stack gap="lg">
          <Card withBorder>
            <Title order={2}>
              Good {getTimeOfDay()}, {user?.firstname}! 👋
            </Title>
            <Text c="dimmed" mt="xs">
              Here's what's happening with your emails today.
            </Text>
          </Card>

          <Grid>
            {stats.map((stat, index) => (
              <Grid.Col span={{ base: 12, sm: 4 }} key={index}>
                <Card withBorder>
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        {stat.title}
                      </Text>
                      <Title order={3}>{stat.value}</Title>
                      <Text size="xs" c="dimmed">
                        {stat.description}
                      </Text>
                    </Stack>
                    <RingProgress
                      size={80}
                      roundCaps
                      thickness={8}
                      sections={[{ value: stat.progress, color: "blue" }]}
                      label={
                        <Text ta="center" size="xs" fw={700}>
                          {stat.progress}%
                        </Text>
                      }
                    />
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card withBorder>
                <Stack gap={0} mb="md">
                  <Title order={4}>Recent Activity</Title>
                  <Text size="sm" c="dimmed">
                    Your email activity from the past 7 days
                  </Text>
                </Stack>
                {/* Add chart or activity list here */}
                <Paper bg="gray.0" p="xl" ta="center">
                  <Text c="dimmed">Activity chart coming soon</Text>
                </Paper>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder>
                <Stack gap={0} mb="md">
                  <Title order={4}>Quick Actions</Title>
                  <Text size="sm" c="dimmed">
                    Common tasks and shortcuts
                  </Text>
                </Stack>
                <Stack gap="xs">
                  <Button
                    variant="light"
                    fullWidth
                    leftSection={<IconMail size={16} />}
                  >
                    Compose Email
                  </Button>
                  <Button
                    variant="light"
                    fullWidth
                    leftSection={<IconSearch size={16} />}
                  >
                    Search Emails
                  </Button>
                  <Button
                    variant="light"
                    fullWidth
                    leftSection={<IconSettings size={16} />}
                  >
                    Email Settings
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Stack>
  );
}
