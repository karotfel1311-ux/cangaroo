"use client";

import { ActionIcon, Group, TextInput } from "@mantine/core";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { LoaderContext } from "./TestLoader";

interface ListSearchProps {
  search: string | string[] | undefined;
}

export function ListSearch(props: ListSearchProps) {
  const isSearchMode = Boolean(props.search);
  const router = useRouter();
  const load = useContext(LoaderContext);

  return (
    <form
      action={(input) => {
        const raw = Object.fromEntries(input);
        router.push(`?search=${raw.search}`);
        load();
      }}
    >
      <Group gap="xs" align="end" wrap="nowrap">
        <TextInput
          name="search"
          placeholder="Search packages"
          flex={1}
          size="sm"
          defaultValue={props.search}
        />

        <ActionIcon
          size="input-sm"
          variant="default"
          aria-label="Search"
          type="submit"
        >
          <MagnifyingGlassIcon />
        </ActionIcon>

        {isSearchMode && (
          <ActionIcon
            size="input-sm"
            variant="default"
            aria-label="Clear"
            type="button"
            component={Link}
            onNavigate={load}
            href="?"
          >
            <XIcon />
          </ActionIcon>
        )}
      </Group>
    </form>
  );
}
