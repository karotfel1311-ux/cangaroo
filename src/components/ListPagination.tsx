"use client";

import { Pagination } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { LoaderContext } from "./TestLoader";

interface ListPaginationProps {
  pagesCount?: number | string;
  actualPage: number | string;
}

export function ListPagination(props: ListPaginationProps) {
  const s = useSearchParams();
  const search = s.get("search");
  const show = useContext(LoaderContext);

  return (
    <Pagination
      siblings={2}
      total={Number(props.pagesCount)}
      value={Number(props.actualPage)}
      getItemProps={(page) => ({
        component: Link,
        onNavigate: () => show(),
        href: `?page=${page}${search ? `&search=${search}` : ""}`,
      })}
    />
  );
}
