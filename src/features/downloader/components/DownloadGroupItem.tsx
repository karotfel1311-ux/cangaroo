import {
  Accordion,
  Box,
  Group,
  Stack,
  ThemeIcon,
  Text,
  Badge,
  ActionIcon,
  Divider,
  Progress,
} from "@mantine/core";
import {
  BroomIcon,
  CaretDownIcon,
  IdentificationBadgeIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  ArchiveIcon,
  CheckCircleIcon,
  ClockIcon,
  DownloadSimpleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { TaskRecordResponse, TaskStatus } from "../types";

function getGroupStatus(task: TaskRecordResponse): TaskStatus {
  const statuses = new Set(task.items.map((item) => item.status));
  if (statuses.has(TaskStatus.DOWNLOADING)) return TaskStatus.DOWNLOADING;
  if (statuses.has(TaskStatus.EXTRACT_ERROR)) return TaskStatus.EXTRACT_ERROR;
  if (statuses.has(TaskStatus.ERROR)) return TaskStatus.ERROR;
  if (statuses.has(TaskStatus.QUEUED)) return TaskStatus.QUEUED;
  if (statuses.has(TaskStatus.FILE_NOT_FOUND)) return TaskStatus.FILE_NOT_FOUND;
  if (statuses.has(TaskStatus.COMPLETED)) return TaskStatus.COMPLETED;
  return TaskStatus.UNKNOWN;
}

function getStatusUi(status: TaskStatus): {
  label: string;
  color: string;
  icon: React.ReactNode;
} {
  switch (status) {
    case TaskStatus.COMPLETED:
      return {
        label: "Completed",
        color: "green",
        icon: <CheckCircleIcon size={14} />,
      };
    case TaskStatus.ERROR:
      return {
        label: "Error",
        color: "red",
        icon: <WarningCircleIcon size={14} />,
      };
    case TaskStatus.QUEUED:
      return {
        label: "Queued",
        color: "gray",
        icon: <ClockIcon size={14} />,
      };
    case TaskStatus.EXTRACT_ERROR:
      return {
        label: "Extraction error",
        color: "red",
        icon: <ArchiveIcon size={14} />,
      };
    case TaskStatus.FILE_NOT_FOUND:
      return {
        label: "File not found",
        color: "red",
        icon: <ArchiveIcon size={14} />,
      };
    default:
      return {
        label: "Downloading",
        color: "blue",
        icon: <DownloadSimpleIcon size={14} />,
      };
  }
}

function getTaskPercent(downloadedGb: number, totalGb: number): number {
  if (!Number.isFinite(totalGb) || totalGb <= 0) return 0;
  return Math.min(100, Math.round((downloadedGb / totalGb) * 100));
}

interface DownloadGroupItemProps {
  task: TaskRecordResponse;
  isExpanded: boolean;
  handleExpand: () => void;
}

export function DownloadGroupItem({
  task,
  isExpanded,
  handleExpand,
}: DownloadGroupItemProps) {
  const statusUi = getStatusUi(getGroupStatus(task));
  const totalDownloaded = task.items.reduce(
    (sum, item) => sum + item.downloaded_gb,
    0,
  );
  const totalSize = task.items.reduce((sum, item) => sum + item.total_gb, 0);
  const percent = getTaskPercent(totalDownloaded, totalSize);

  return (
    <Accordion.Item value={task.task_id}>
      <Box
        bdrs="md"
        {...(isExpanded && {
          bg: "var(--mantine-color-body)",
          style: { position: "sticky", top: 50, zIndex: 1 },
        })}
      >
        <Box p="md">
          <Group justify="space-between" align="start">
            <Group align="flex-start" wrap="nowrap" gap="sm">
              <ThemeIcon variant="light" color={statusUi.color} size="md">
                {statusUi.icon}
              </ThemeIcon>
              <Stack gap={2} flex={1} miw={0}>
                <Text size="sm" fw={500}>
                  {task.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {totalDownloaded.toFixed(1)} / {totalSize.toFixed(1)} GB (
                  {percent}%)
                </Text>
                <Badge
                  size="xs"
                  color={statusUi.color}
                  variant="light"
                  w="fit-content"
                >
                  {statusUi.label}
                </Badge>
              </Stack>
            </Group>
            <Group justify="center">
              <ActionIcon variant="subtle" color="red" aria-label="Delete task">
                <IdentificationBadgeIcon size={14} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="red" aria-label="Delete task">
                <BroomIcon size={14} />
              </ActionIcon>
              {true ? (
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label="Delete task"
                >
                  <PlayIcon size={14} />
                </ActionIcon>
              ) : (
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label="Delete task"
                >
                  <PauseIcon size={14} />
                </ActionIcon>
              )}

              <ActionIcon variant="subtle" color="red" aria-label="Delete task">
                <TrashIcon size={14} />
              </ActionIcon>
              <Divider orientation="vertical" />
              <ActionIcon variant="default" onClick={handleExpand}>
                <CaretDownIcon
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "",
                  }}
                />
              </ActionIcon>
            </Group>
          </Group>
          <Progress value={percent} size="xs" mt="xs" color={statusUi.color} />
        </Box>

        {isExpanded && <Divider />}
      </Box>

      <Accordion.Panel>
        <Stack gap="xs">
          {task.items.map((item) => {
            const itemPercent = getTaskPercent(
              item.downloaded_gb,
              item.total_gb,
            );
            const itemStatusUi = getStatusUi(item.status);

            return (
              <Box key={item.id} p="xs">
                <Group align="flex-start" wrap="nowrap" gap="sm">
                  <ThemeIcon
                    variant="light"
                    color={itemStatusUi.color}
                    size="sm"
                  >
                    {itemStatusUi.icon}
                  </ThemeIcon>
                  <Stack gap={2} flex={1} miw={0}>
                    <Text size="sm">{item.title}</Text>
                    <Text size="xs" c="dimmed">
                      {item.downloaded_gb.toFixed(1)} /{" "}
                      {item.total_gb.toFixed(1)} GB ({itemPercent}
                      %)
                    </Text>
                  </Stack>
                </Group>
                <Progress
                  value={itemPercent}
                  size="xs"
                  mt="xs"
                  color={itemStatusUi.color}
                />
              </Box>
            );
          })}
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
