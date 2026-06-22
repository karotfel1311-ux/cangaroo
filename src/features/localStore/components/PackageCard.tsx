"use client";

import { Badge, Button, Card, Group, Image, Stack, Text } from "@mantine/core";
import { GameDetailsDrawer } from "./GameDetailsDrawer";
import { InstalatorSchema } from "../schemas/instalatorSchema";
import { PkgMappedItem } from "../../localScanner/utils/types";
import { ConfigSchema } from "../../configuration/schemas/configSchema";

interface PackageCardResolvedProps {
  item: PkgMappedItem;
  appConfig: ConfigSchema;
  instalConfig: InstalatorSchema;
}

export function PackageCard({
  item,
  appConfig,
  instalConfig,
}: PackageCardResolvedProps) {
  const isGroup = item?.packages?.length;
  return (
    <>
      <Card withBorder>
        <Card.Section>
          {item.imagePath ? (
            <Image
              src={item.imagePath}
              alt={item.title || "Image"}
              h={180}
              fit="cover"
            />
          ) : (
            <Stack p="md" align="center" justify="center" h={180}>
              <Text c="dimmed">No Image</Text>
            </Stack>
          )}
        </Card.Section>

        <Stack gap="xs" mt="sm" h="100%">
          <Text fw={500}>{item.title}</Text>
          {!isGroup && (
            <Group gap="xs">
              <Badge variant="light">{item.fileSizeStr}</Badge>
            </Group>
          )}

          <GameDetailsDrawer
            item={item}
            appConfig={appConfig}
            instalConfig={instalConfig}
          >
            {(show) => (
              <Button variant="default" onClick={show} mt="auto">
                Details
              </Button>
            )}
          </GameDetailsDrawer>
        </Stack>
      </Card>
    </>
  );
}
