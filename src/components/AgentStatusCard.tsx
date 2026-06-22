import { Card, Text, Group, Stack } from "@mantine/core";
import { AppStatus } from "../utils/status";
import { InstalatorSchema } from "../features/localStore/schemas/instalatorSchema";

interface AgentStatusCardProps {
  status: AppStatus;
  instalator: InstalatorSchema | undefined;
}

export async function AgentStatusCard({
  status,
  instalator,
}: AgentStatusCardProps) {
  return (
    <Card withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            CURRENT DEVICE
          </Text>
          <Text size="xs">{status.device}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            ACTIVE STRATEGY
          </Text>
          <Text size="xs">{instalator?.instal_method || "-"} </Text>
        </Group>
      </Stack>
    </Card>
  );
}
