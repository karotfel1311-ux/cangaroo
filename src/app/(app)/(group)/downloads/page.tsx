import { Stack, Text } from "@mantine/core";

import { PageWrapper } from "../../../../components/PageWrapper";
import { DownloadList } from "../../../../features/downloader/components/DownloadList";
import { RefreshStatus } from "../../../../features/downloader/components/RefreshStatus";
import { getActiveDownloader } from "../../../../features/downloader/utils/getActiveDownloader";

export default async function ActiveTasksDropdown() {
  const jd = await getActiveDownloader();
  const tasks = await jd?.fetchTasks();
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
          <DownloadList tasks={reversed} />
        )}
      </Stack>
    </PageWrapper>
  );
}
