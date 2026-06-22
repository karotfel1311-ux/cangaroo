"use server";

import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  Box,
  Stack,
} from "@mantine/core";
import { AgentStatusCard } from "../../components/AgentStatusCard";
import { SideMenu } from "../../components/SideMenu";
import { getConfig } from "../../queries/getConfig";
import { getAppStatus } from "../../utils/status";
import {
  getInstalatorConfig,
  getInstalatorMetadata,
} from "../../features/localStore/utils/instalator";
import { LoaderOverlay } from "../../components/TestLoader";
import Image from "next/image";
import logo from "../../assets/logo.png";

export default async function Layout(props: LayoutProps<"/">) {
  const config = await getConfig();
  const status = await getAppStatus();
  const instalatorConfig = await getInstalatorConfig();
  const instalatorMeta = getInstalatorMetadata();

  return (
    <AppShell layout="alt" navbar={{ width: 300, breakpoint: 0 }}>
      <AppShellNavbar p="md" visibleFrom="sm">
        <Stack>
          <Box pos="relative" h="40px">
            <Image src={logo.src} layout="fill" objectFit="scale-down" />
          </Box>
          <AgentStatusCard instalator={instalatorConfig} status={status} />
          <SideMenu
            status={status}
            config={config}
            settingsInstalatorOptions={instalatorConfig}
            settingsInstalatorMeta={instalatorMeta}
          />
        </Stack>
      </AppShellNavbar>
      <AppShellMain
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "relative",
        }}
      >
        <LoaderOverlay>{props.children}</LoaderOverlay>
      </AppShellMain>
    </AppShell>
  );
}
