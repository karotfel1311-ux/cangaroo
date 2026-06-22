import {
  Card,
  Center,
  SimpleGrid,
  Image,
  CardSection,
  Stack,
  Text,
} from "@mantine/core";
import { ListSearch } from "../../../components/ListSearch";
import { PageWrapper } from "../../../components/PageWrapper";
import { safeArray } from "../../../utils/safeArray";
import { strategies } from "../integrations";
import { ListPagination } from "../../../components/ListPagination";
import { LinkButton } from "../../../components/LinkButton";

export async function RemoteItem(props: {
  page: number;
  search: string;
  category: string;
  store: string;
}) {
  const page = Number(props.page || 1);
  const search = safeArray(props?.search)?.[0] || "";

  const fetcher = props.store in strategies ? strategies[props.store] : null;
  const data = await fetcher?.fetchList(page, search, props.category);

  return (
    <PageWrapper
      title={`Repo ${props.store} ${props.category}`}
      actionSlot={<ListSearch search={props.search} />}
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
                  href={`/remote/${props.store}/${props.category}/${item.slug}`}
                />
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </div>
    </PageWrapper>
  );
}
