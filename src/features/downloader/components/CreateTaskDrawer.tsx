import {
  Button,
  Drawer,
  FileInput,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useToast } from "../../../providers/ToastProvider";
import { createTask } from "../actions/createTask";
import z from "zod";
import { log } from "../../../utils/serverLog";
import { withTrigger } from "../../../components/with-trigger";

export interface AddGameFormValues {
  files: File[];
  links: string;
  password: string;
}

const formSchema = z.object({
  links: z.string().transform((input) => input.split("\n")),
  password: z.string(),
});

export const CreateTaskDrawer = withTrigger(({ handleHide, isVisible }) => {
  const showToast = useToast();

  const handleSubmit = async (input: FormData) => {
    try {
      const rawFormData = Object.fromEntries(input);
      const parsed = await formSchema.parseAsync(rawFormData);
      // const files = rawFormData.files
      //   .map((file) => ({
      //     name: file.name.trim(),
      //     size_gb: Number((file.size / 1024 ** 3).toFixed(2)),
      //   }))
      //   .filter((file) => file.name.length > 0);

      const urls = parsed.links.map((line) => line.trim()).filter(Boolean);
      const password = parsed.password;

      await createTask({ links: urls, id: "TASK1", password });

      showToast("Task created!", true);
    } catch (err) {
      log("failed to create task", err);
      showToast("Failed to create tasks.", false);
    }
  };

  return (
    <Drawer
      opened={isVisible}
      onClose={handleHide}
      title="Download"
      position="right"
      size="md"
    >
      <form action={handleSubmit}>
        <Stack>
          <FileInput
            label="Select files (.dlc)"
            name="files"
            multiple
            clearable
            disabled
          />
          <Stack gap="xs"></Stack>

          <Textarea
            label="Download links (one per line)"
            minRows={4}
            name="links"
          />
          <TextInput label="Archive password" name="password" />

          <Button type="submit">Save</Button>
        </Stack>
      </form>
    </Drawer>
  );
});
