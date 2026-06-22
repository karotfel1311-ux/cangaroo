"use client";

import { Box, NavLink } from "@mantine/core";
import {
  GlobeIcon,
  HardDriveIcon,
  NetworkIcon,
} from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ConfigDrawer } from "../features/configuration/components/ConfigDrawer";
import { AppStatus } from "../utils/status";
import { CreateTaskDrawer } from "../features/downloader/components/CreateTaskDrawer";
import { revalidateStorage } from "../features/localScanner/actions/revalidateStorage";
import { ConfigSchema } from "../features/configuration/schemas/configSchema";

interface SideMenuProps {
  config: ConfigSchema;
  status: AppStatus | null;
  configInstalatorOptions:
    | Record<string, string | Record<string, string>>
    | undefined;
  configInstalatorMeta: Record<string, unknown> | undefined;
}

export function SideMenu({
  config,
  status,
  configInstalatorMeta,
  configInstalatorOptions,
}: SideMenuProps) {
  const pathname = usePathname();

  return (
    <>
      <Box>
        <NavLink
          href="/local"
          component={Link}
          active={pathname.startsWith("/local")}
          label="Local files"
          leftSection={<HardDriveIcon size={16} />}
        />
        <NavLink
          component={Link}
          href="#"
          label="Downloader"
          leftSection={<NetworkIcon size={16} />}
          defaultOpened={pathname.startsWith("/downloads")}
        >
          <NavLink
            component={Link}
            label="List"
            href="/downloads"
            active={pathname.startsWith("/downloads")}
          />
          <CreateTaskDrawer>
            {(show) => <NavLink label="New task" href="#" onClick={show} />}
          </CreateTaskDrawer>
        </NavLink>
        <NavLink
          component={Link}
          href="#"
          label="Remote repository"
          leftSection={<GlobeIcon size={16} />}
          childrenOffset={28}
        >
          <NavLink
            component={Link}
            label="DLPS PS4"
            href="/remote/dlps/ps4"
            active={pathname.startsWith("/remote/dlps/ps4")}
          />
          <NavLink
            component={Link}
            label="DLPS PS5"
            href="/remote/dlps/ps5"
            active={pathname.startsWith("/remote/dlps/ps5")}
          />
        </NavLink>
        <NavLink
          label="Refresh local repo"
          href="#"
          onClick={revalidateStorage}
        />
        <NavLink label="Reconnect downloader" href="#" onClick={() => {}} />
        <ConfigDrawer
          config={config}
          status={status}
          configInstalatorMeta={configInstalatorMeta}
          configInstalatorOptions={configInstalatorOptions}
        >
          {(show) => <NavLink label="Configuration" href="#" onClick={show} />}
        </ConfigDrawer>
      </Box>
      {/* <RefreshButton /> */}
    </>
  );
}
