"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import { useContext } from "react";
import { LoaderContext } from "./TestLoader";

interface LinkButtonProps {
  title: string;
  href: string;
}
export function LinkButton(props: LinkButtonProps) {
  const show = useContext(LoaderContext);
  return (
    <Button
      variant="default"
      mt="auto"
      component={Link}
      href={props.href.replaceAll("//", "/")}
      onNavigate={() => {
        show();
      }}
    >
      {props.title}
    </Button>
  );
}
