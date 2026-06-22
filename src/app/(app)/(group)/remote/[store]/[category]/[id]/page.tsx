import {
  Text,
  Code,
  Grid,
  GridCol,
  Group,
  Image,
  Stack,
  Box,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  ActionIcon,
} from "@mantine/core";
import { PageWrapper } from "../../../../../../../components/PageWrapper";
import { RemoteLinksGroup } from "../../../../../../../components/RemoteLinksGroup";
import { Fragment } from "react/jsx-runtime";
import { strategies } from "../../../../../../../features/remoteRepository";
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import { getDownloader } from "../../../../../../../features/downloader/utils/jdownloader";
import { getCacheEntry } from "../../../../../../../features/remoteRepository/utils/getCacheEntry";
import { loadLocalFiles } from "../../../../../../../features/localScanner";

export default async function Page({
  params,
}: PageProps<"/remote/[store]/[category]/[id]">) {
  const { id, store } = await params;
  const fetcher = store in strategies ? strategies[store] : null;
  const data = await fetcher?.fetchItem(id);

  // const jd = await getDownloader();
  // const tasks = await jd?.getTasks();
  // const cachedEntry = loadLocalFiles();
  return (
    <PageWrapper
      title={data?.title || "Unknown"}
      actionSlot={
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <ActionIcon size="input-sm">
            <ArrowSquareOutIcon />
          </ActionIcon>
        </Box>
      }
    >
      <Grid>
        <GridCol span={8}>
          <Stack>
            <Accordion defaultValue={"0"}>
              {data?.sections.map((section, sectionIndex) => {
                return (
                  <AccordionItem
                    key={sectionIndex}
                    value={String(sectionIndex)}
                  >
                    <AccordionControl>
                      Option #{sectionIndex + 1}
                    </AccordionControl>
                    <AccordionPanel>
                      <Stack>
                        <Stack gap="xs">
                          {section.solid.map((item, i) => {
                            const [key, value] = item.split(":");

                            return (
                              <Fragment key={key + i}>
                                <Text size="sm">{key}</Text>
                                <Code block style={{ overflow: "clip" }}>
                                  {value}
                                </Code>
                              </Fragment>
                            );
                          })}
                        </Stack>
                        <Text size="sm">Note:</Text>
                        <Code block>
                          {section.info.map((item) => (
                            <Fragment key={item}>
                              {item}
                              <br />
                            </Fragment>
                          ))}
                        </Code>
                        <RemoteLinksGroup links={section.links} />
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
            <Box></Box>
          </Stack>
        </GridCol>
        <GridCol span={4}>
          <Group>
            {data?.videoUrl && (
              <iframe
                id="ytplayer"
                width="100%"
                height="300px"
                src={data?.videoUrl}
              />
            )}
            {data?.images?.map((item) => (
              <Image src={item} key={item} alt="preview" />
            ))}
          </Group>
        </GridCol>
      </Grid>
    </PageWrapper>
  );
}
