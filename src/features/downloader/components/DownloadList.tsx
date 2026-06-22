"use client";

import { Accordion } from "@mantine/core";
import { useState } from "react";
import { DownloadGroupItem } from "./DownloadGroupItem";
import { TaskRecordResponse } from "../types";

interface DownloadListProps {
  tasks: Array<TaskRecordResponse> | undefined;
}

export function DownloadList(props: DownloadListProps) {
  const [exppandedItem, setExpandedItem] = useState<null | string>(null);

  return (
    <Accordion
      variant="separated"
      value={exppandedItem}
      onChange={setExpandedItem}
    >
      {props.tasks?.map((task) => {
        const isExpanded = task.task_id === exppandedItem;
        return (
          <DownloadGroupItem
            key={task.task_id}
            task={task}
            isExpanded={isExpanded}
            handleExpand={() =>
              setExpandedItem(isExpanded ? null : task.task_id)
            }
          />
        );
      })}
    </Accordion>
  );
}
