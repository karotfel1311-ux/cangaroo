"use client";

import { Box, NavLink } from "@mantine/core";
import {
  GlobeIcon,
  HardDriveIcon,
  NetworkIcon,
} from "@phosphor-icons/react/dist/ssr";
import { AppConfig } from "../queries/getConfig";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SettingsDrawer } from "../features/settings/components/SettingsDrawer";
import { AppStatus } from "../utils/status";
import { CreateTaskDrawer } from "../features/downloader/components/CreateTaskDrawer";
import { revalidateStorage } from "../features/localScanner/actions/revalidateStorage";

interface SideMenuProps {
  config: AppConfig;
  status: AppStatus;
  settingsInstalatorOptions:
    | Record<string, string | Record<string, string>>
    | undefined;
  settingsInstalatorMeta: Record<string, unknown> | undefined;
}

export function SideMenu({
  config,
  status,
  settingsInstalatorMeta,
  settingsInstalatorOptions,
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
        <SettingsDrawer
          config={config}
          status={status}
          settingsInstalatorMeta={settingsInstalatorMeta}
          settingsInstalatorOptions={settingsInstalatorOptions}
        >
          {(show) => <NavLink label="Settings" href="#" onClick={show} />}
        </SettingsDrawer>
      </Box>
      {/* <RefreshButton /> */}
    </>
  );
}
