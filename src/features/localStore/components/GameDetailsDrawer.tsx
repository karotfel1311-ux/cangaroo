import {
  Accordion,
  ActionIcon,
  Badge,
  Code,
  Divider,
  Drawer,
  Grid,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { InstalatorSchema } from "../schemas/instalatorSchema";
import { PkgMappedItem } from "../../localScanner/utils/types";
import { withTrigger } from "../../../components/with-trigger";
import { parseGroupDirName } from "../../../utils/parseGroupName";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr";
import { useToast } from "../../../providers/ToastProvider";
import { installPackage } from "../actions/installPackage";
import { log } from "../../../utils/serverLog";
import { useState } from "react";
import { ConfigSchema } from "../../configuration/schemas/configSchema";

interface GameDetailsDrawerProps {
  item: PkgMappedItem;
  appConfig: ConfigSchema;
  instalConfig: InstalatorSchema;
}

function formatBytes(bytes: number | null): string {
  if (!bytes || !Number.isFinite(bytes) || bytes < 0) return "Unknown";
  return new Intl.NumberFormat("en-US").format(bytes);
}

export const GameDetailsDrawer = withTrigger<GameDetailsDrawerProps>(
  ({ item, isVisible, handleHide }) => {
    const groupedLinks = Object.groupBy(
      item.packages || [],
      (item) => parseGroupDirName(item.filePath).description || "unknown",
    );

    const showToast = useToast();
    const [activeDetails, setActiveDetails] = useState<PkgMappedItem | null>(
      null,
    );

    const handler = async (items: Array<string>) => {
      try {
        await installPackage(items);
        showToast("Task started on device!", true);
      } catch (err) {
        log("Install pkg failed", err);
        showToast("This strategy is not available.", false);
      }
    };
    return (
      <Drawer
        opened={isVisible}
        onClose={handleHide}
        title={item?.title || "XD"}
        position="right"
        size="xl"
      >
        {!item ? null : (
          <Stack>
            <Stack
              style={{
                position: "sticky",
                top: "55px",
                zIndex: 2,
                background: "var(--mantine-color-body)",
              }}
            >
              <Grid>
                <Grid.Col span={4}>
                  {item.imagePath ? (
                    <Image
                      src={item.imagePath}
                      alt={item.title || "Hero image"}
                      radius="sm"
                      maw="300px"
                    />
                  ) : null}
                </Grid.Col>
                <Grid.Col span={8}>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <Badge variant="light">
                        {activeDetails?.fileSizeStr || "-"}
                      </Badge>
                    </Group>

                    <Stack gap={4}>
                      <Text size="sm">Size (bytes):</Text>
                      <Code block>
                        {formatBytes(activeDetails?.fileSizeBytes || null) ||
                          "-"}
                      </Code>
                      <Text size="sm">Content ID:</Text>
                      <Code block>{activeDetails?.contentId ?? "-"}</Code>
                      <Text size="sm">File path:</Text>
                      <Code block>{activeDetails?.filePath}</Code>
                      <Text size="sm">Install URL:</Text>
                      <Code block>{activeDetails?.installUrl}</Code>
                    </Stack>
                  </Stack>
                </Grid.Col>
              </Grid>
              <Divider />
            </Stack>

            <Stack gap="xs">
              <Accordion>
                {Object.entries(groupedLinks).map(([groupName, items]) => (
                  <Accordion.Item key={groupName} value={groupName}>
                    <Accordion.Control>{groupName}</Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs">
                        {items?.map((pack) => (
                          <Grid key={pack.filePath} align="center">
                            <ActionIcon
                              onClick={() => handler([pack.installUrl!])}
                              onMouseOver={() => setActiveDetails(pack)}
                            >
                              <PaperPlaneTiltIcon />
                            </ActionIcon>

                            <Text size="sm">{pack.title}</Text>
                          </Grid>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Stack>
          </Stack>
        )}
      </Drawer>
    );
  },
);
