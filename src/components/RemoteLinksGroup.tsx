"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import { useToast } from "../providers/ToastProvider";
import { checkLink } from "../features/downloader/actions/checkLink";
import { SingleItemSection } from "../features/remoteRepository/types/strategy";
import { useState } from "react";
import { log } from "../utils/serverLog";

interface RemoteLinksGroupProps {
  links: SingleItemSection["links"];
}

type Status = null | "fileExists" | "downloading" | "checking";
function getAppearance(input: Status) {
  switch (input) {
    case "checking":
      return { children: "Checking...", color: "yellow", variant: "filled" };
    case "downloading":
      return { children: "Downloading...", color: "orange", variant: "filled" };
    case "fileExists":
      return { children: "File exists", color: "lime", variant: "filled" };
    default:
      return { children: "Auto load", color: "violet", variant: "filled" };
  }
}

export function RemoteLinksGroup(props: RemoteLinksGroupProps) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const show = useToast();

  if (!props.links?.length) return null;

  async function autoload(
    input: Array<{ address: string; provider: string }>,
    id: string,
  ) {
    setPending(true);
    try {
      await checkLink({ links: input, id });
      show("task started!", true);
    } catch (err) {
      log("Error on finding link", err);
      show("Autoloading task failed", false);
    }
    setPending(false);
  }

  return (
    <Stack gap="xs">
      {props.links.map((linkGroup) => (
        <Stack key={linkGroup.groupName} gap="xs">
          <Text fw={600}>{linkGroup.groupName}</Text>
          <Group>
            <Button
              loading={pending}
              {...getAppearance(status)}
              onClick={() => autoload(linkGroup.items, linkGroup.id)}
            />
            {linkGroup.items.map((item, i) => (
              <Button
                key={item.address + i}
                target="_blank"
                component="a"
                href={item.address}
              >
                {item.provider}
              </Button>
            ))}
          </Group>
        </Stack>
      ))}
    </Stack>
  );
}
