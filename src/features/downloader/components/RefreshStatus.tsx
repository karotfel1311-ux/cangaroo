import { Group, Text, ActionIcon } from "@mantine/core";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react/dist/ssr";
import dayjs from "dayjs";

interface RefreshStatusProps {
  lastUpdatedAt: string;
}

export function RefreshStatus(props: RefreshStatusProps) {
  const lastUpdatedLabel =
    props.lastUpdatedAt && dayjs(props.lastUpdatedAt).isValid()
      ? dayjs(props.lastUpdatedAt).fromNow()
      : "-";

  return (
    <Group gap="xs" wrap="nowrap">
      <Text size="xs" c="dimmed" ml="auto">
        Last update {lastUpdatedLabel}
      </Text>
      <ActionIcon variant="subtle" aria-label="Refresh active tasks">
        <ArrowsClockwiseIcon size={16} />
      </ActionIcon>
    </Group>
  );
}
