"use client";

import {
  AppShellFooter,
  AppShellHeader,
  AppShellSection,
  Box,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import { useElementHeight } from "../hooks/useElementHeight";

interface PageWrapperProps extends PropsWithChildren {
  title: string;
  actionSlot?: ReactNode;
  footerSlot?: ReactNode;
}
export function PageWrapper(props: PageWrapperProps) {
  const { elementRef: headerRef, height: headerHeight } = useElementHeight(50);
  const { elementRef: footerRef, height: footerHeight } = useElementHeight(0);
  return (
    <>
      <AppShellHeader ref={headerRef} p="sm">
        <Group justify="space-between" wrap="nowrap" h="100%" w="100%" px="sm">
          <Text fw={600} flex={2}>
            {props.title}
          </Text>
          <Box flex={1}>{props.actionSlot}</Box>
        </Group>
      </AppShellHeader>

      <AppShellSection grow component={ScrollArea}>
        <div style={{ height: headerHeight }} />

        <Box p={"md"}>{props.children}</Box>
        <div style={{ height: footerHeight }} />
      </AppShellSection>

      {props.footerSlot && (
        <AppShellFooter p="sm" ref={footerRef}>
          {props.footerSlot}
        </AppShellFooter>
      )}
    </>
  );
}
