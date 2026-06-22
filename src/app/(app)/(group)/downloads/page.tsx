import { Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PageWrapper } from "../../../../components/PageWrapper";
import { DownloadList } from "../../../../features/downloader/components/DownloadList";
import { RefreshStatus } from "../../../../features/downloader/components/RefreshStatus";
import { getDownloader } from "../../../../features/downloader/utils/jdownloader";

dayjs.extend(relativeTime);

export default async function ActiveTasksDropdown() {
  const jd = await getDownloader();
  const tasks = await jd?.getTasks();
  const reversed = tasks?.toReversed();

  return (
    <PageWrapper
      title={"Active tasks"}
      actionSlot={<RefreshStatus lastUpdatedAt={new Date().toISOString()} />}
    >
      <Stack gap="xs" w="100%">
        {!reversed?.length ? (
          <Text size="sm" c="dimmed">
            No active tasks
          </Text>
        ) : (
          //@ts-expect-error tasks
          <DownloadList tasks={reversed} />
        )}
      </Stack>
    </PageWrapper>
  );
}
