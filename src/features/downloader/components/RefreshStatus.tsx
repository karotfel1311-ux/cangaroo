"use client";

import { Group, Text, ActionIcon } from "@mantine/core";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react/dist/ssr";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
interface RefreshStatusProps {
  lastUpdatedAt: string;
}

dayjs.extend(relativeTime);

export function RefreshStatus(props: RefreshStatusProps) {
  const [now, setNow] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleUpdate = () => {
      const lastUpdatedLabel =
        props.lastUpdatedAt && dayjs(props.lastUpdatedAt).isValid()
          ? dayjs(props.lastUpdatedAt).fromNow()
          : "-";
      setNow(lastUpdatedLabel);
    };

    const intervalId = setInterval(handleUpdate, 5_000);
    handleUpdate();
    return () => {
      clearInterval(intervalId);
    };
  }, [props.lastUpdatedAt]);

  return (
    <Group gap="xs" wrap="nowrap">
      <Text size="xs" c="dimmed" ml="auto">
        Last update {now}
      </Text>
      <ActionIcon
        variant="subtle"
        aria-label="Refresh active tasks"
        onClick={router.refresh}
      >
        <ArrowsClockwiseIcon size={16} />
      </ActionIcon>
    </Group>
  );
}
