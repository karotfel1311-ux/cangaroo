import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  Box,
  Stack,
} from "@mantine/core";
import { AgentStatusCard } from "../../components/AgentStatusCard";
import { SideMenu } from "../../components/SideMenu";
import { getAppStatus } from "../../utils/status";
import {
  getInstalatorConfig,
  getInstalatorMetadata,
} from "../../features/localStore/utils/instalator";
import { LoaderOverlay } from "../../components/TestLoader";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { getBaseConfigContent } from "../../features/configuration/utils/getConfigContent";

export default async function Layout(props: LayoutProps<"/">) {
  const config = getBaseConfigContent();
  const { data: status } = await getAppStatus(null);
  const instalatorConfig = await getInstalatorConfig();
  const instalatorMeta = getInstalatorMetadata();
  return (
    <AppShell layout="alt" navbar={{ width: 300, breakpoint: 0 }}>
      <AppShellNavbar p="md" visibleFrom="sm">
        <Stack>
          <Box pos="relative" h="40px">
            <Image
              src={logo.src}
              fill
              alt="app-logo"
              style={{ objectFit: "scale-down" }}
              sizes="100%"
              loading="eager"
            />
          </Box>
          <AgentStatusCard instalator={instalatorConfig} status={status} />
          <SideMenu
            status={status}
            config={config}
            configInstalatorOptions={instalatorConfig}
            configInstalatorMeta={instalatorMeta}
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
