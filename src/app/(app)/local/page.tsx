"use server";

import { safeArray } from "../../../utils/safeArray";
import { PageWrapper } from "../../../components/PageWrapper";
import { ListSearch } from "../../../components/ListSearch";
import { ListPagination } from "../../../components/ListPagination";
import { Center, SimpleGrid, Text } from "@mantine/core";
import { PackageCard } from "../../../features/localStore/components/PackageCard";
import { loadLocalFiles } from "../../../features/localScanner";
import { getInstalatorConfig } from "../../../features/localStore/utils/instalator";
import { getBaseConfigContent } from "../../../features/configuration/utils/getConfigContent";

const ITEMS_PER_PAGE = 16;

export default async function ShopPage({ searchParams }: PageProps<"/local">) {
  const query = await searchParams;
  const page = Number(query.page || 1);
  const search = String(safeArray(query?.search)?.[0] || "");
  const parsedSearch = search.trim().toLowerCase();

  const allItems = loadLocalFiles();
  const matched = allItems.filter((item) => {
    return item.title?.toLowerCase().includes(parsedSearch);
  });

  const total = allItems?.length;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const items = matched.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = total > 0 ? Math.ceil(total / ITEMS_PER_PAGE) : 0;

  const config = getBaseConfigContent();
  const instalConfig = await getInstalatorConfig();

  return (
    <PageWrapper
      title="Local repository"
      actionSlot={<ListSearch search={query.search} />}
      footerSlot={
        <Center>
          <ListPagination actualPage={Number(page)} pagesCount={totalPages} />
        </Center>
      }
    >
      <>
        {search && (
          <Text size="sm" c="dimmed">
            Search results for: {search}
          </Text>
        )}
        {!Boolean(items?.length) ? (
          <Text c="dimmed">No packages found.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 6 }}>
            {items?.map((item, index) => (
              <PackageCard
                appConfig={config}
                key={`${item.installUrl ?? item.title ?? "item"}-${index}`}
                instalConfig={instalConfig!}
                item={item}
              />
            ))}
          </SimpleGrid>
        )}
      </>
    </PageWrapper>
  );
}
