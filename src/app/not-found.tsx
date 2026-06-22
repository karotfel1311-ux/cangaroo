import { Center, EmptyState, EmptyStateActions } from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "../components/LinkButton";

export default function NotFound() {
  return (
    <Center h="80vh">
      <EmptyState
        icon={<MagnifyingGlassIcon />}
        title="Not found"
        description="Given page is not available."
      >
        <EmptyStateActions>
          <LinkButton href="/" title="Home page" />
        </EmptyStateActions>
      </EmptyState>
    </Center>
  );
}
