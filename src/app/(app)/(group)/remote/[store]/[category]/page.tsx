import {
  Card,
  Image,
  CardSection,
  Text,
  SimpleGrid,
  Stack,
  Center,
} from "@mantine/core";

import { safeArray } from "../../../../../../utils/safeArray";
import { strategies } from "../../../../../../features/remoteRepository";
import { ListPagination } from "../../../../../../components/ListPagination";
import { ListSearch } from "../../../../../../components/ListSearch";
import { PageWrapper } from "../../../../../../components/PageWrapper";
import { LinkButton } from "../../../../../../components/LinkButton";

export default async function Page({
  params,
  searchParams,
}: PageProps<"/remote/[store]/[category]">) {
  const { store, category } = await params;
  const query = await searchParams;
  const page = Number(query.page || 1);
  const search = safeArray(query?.search)?.[0] || "";

  const fetcher = store in strategies ? strategies[store] : null;
  const data = await fetcher?.fetchList(page, search, category);

  return (
    <PageWrapper
      title={`Repo ${store} ${category}`}
      actionSlot={<ListSearch search={query.search} />}
      footerSlot={
        <Center>
          <ListPagination
            actualPage={Number(data?.currentPage)}
            pagesCount={data?.pages}
          />
        </Center>
      }
    >
      <div>
        <SimpleGrid cols={6}>
          {data?.items?.map((item) => (
            <Card withBorder key={item.title} pt={0}>
              <CardSection>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    h={180}
                    fit="cover"
                  />
                ) : (
                  <Stack p="md" align="center" justify="center" h={180}>
                    <Text c="dimmed">No Image</Text>
                  </Stack>
                )}
              </CardSection>

              <Stack gap="xs" mt="sm" h="100%">
                <Text size="sm" fw={500} lineClamp={2}>
                  {item.title}
                </Text>
                <LinkButton
                  title="Details"
                  href={`/remote/${store}/${category}/${item.slug}`}
                />
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </div>
    </PageWrapper>
  );
}
