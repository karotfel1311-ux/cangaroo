import { Card, Text, Group, Stack, ThemeIcon } from "@mantine/core";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { AppStatus } from "../utils/status";
import { InstalatorSchema } from "../features/localStore/schemas/instalatorSchema";

function StatusIndicator({ ok }: { ok: boolean }) {
  return (
    <ThemeIcon variant="transparent" color={ok ? "green" : "red"} size="sm">
      {ok ? (
        <CheckCircleIcon size={16} weight="fill" />
      ) : (
        <XCircleIcon size={16} weight="fill" />
      )}
    </ThemeIcon>
  );
}

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
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            DOWNLOADER
          </Text>
          <StatusIndicator ok={status.downloader_ok} />
        </Group>
      </Stack>
    </Card>
  );
}
