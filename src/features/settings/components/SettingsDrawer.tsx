import {
  Button,
  Drawer,
  NativeSelect,
  Stack,
  Text,
  TextInput,
  Blockquote,
} from "@mantine/core";
import { AppConfig } from "../../../queries/getConfig";
import { AppStatus } from "../../../utils/status";
import { useForm } from "react-hook-form";
import { useToast } from "../../../providers/ToastProvider";
import { withTrigger } from "../../../components/with-trigger";
import { handleUpdateSettings } from "../actions/updateSettings";

interface SettingsDrawerProps {
  config: AppConfig;
  status: AppStatus;
  settingsInstalatorOptions:
    | Record<string, string | Record<string, string>>
    | undefined;
  settingsInstalatorMeta: Record<string, unknown> | undefined;
}

export const SettingsDrawer = withTrigger<SettingsDrawerProps>((props) => {
  const methods = useForm<Record<string, string>>({
    defaultValues: { ...props.config, ...props.settingsInstalatorOptions },
  });
  const toast = useToast();

  const availableStrategies = Object.entries(
    props.settingsInstalatorOptions || {},
  ).filter(([_, opt]) => typeof opt === "object");

  const onSubmit = async (values: Record<string, string>) => {
    handleUpdateSettings(values);
    toast("Settings updated", true);
    props.handleHide();
  };

  return (
    <>
      <Drawer
        opened={props.isVisible}
        onClose={props.handleHide}
        position="right"
        title="Settings"
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              {...methods.register("console_address")}
              label="Console address"
              placeholder="192.168.0.50"
            />
            <TextInput
              {...methods.register("server_address")}
              label="File server address"
              placeholder="http://192.168.0.50:3000"
            />
            <NativeSelect
              {...methods.register("instal_method")}
              label="Active install method"
              data={["", ...availableStrategies.map(([key]) => key)]}
            />
            <Stack>
              {availableStrategies.map(([key, opt]) => {
                if (typeof opt !== "object") return null;
                const sectionMeta = props.settingsInstalatorMeta?.[
                  key
                ] as Record<string, unknown>;
                return (
                  <Stack gap="xs" key={key}>
                    <Text fw={700}>{key} strategy</Text>
                    {Boolean(sectionMeta?.description) && (
                      <Blockquote p="xs">
                        {String(sectionMeta?.description)}
                      </Blockquote>
                    )}
                    <Stack ml="xs">
                      {Object.entries(opt).map(([optKey]) => (
                        <TextInput
                          {...methods.register(`${key}.${optKey}`)}
                          //@ts-expect-error dynamic component
                          {...sectionMeta?.[optKey]}
                          label={optKey}
                          key={optKey}
                        />
                      ))}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>

            <Button type="submit">Save</Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
});
