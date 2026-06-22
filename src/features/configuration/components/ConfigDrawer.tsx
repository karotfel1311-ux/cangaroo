import {
  Button,
  Drawer,
  NativeSelect,
  Stack,
  Text,
  TextInput,
  Blockquote,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
} from "@mantine/core";
import { AppStatus } from "../../../utils/status";
import { useForm } from "react-hook-form";
import { useToast } from "../../../providers/ToastProvider";
import { withTrigger } from "../../../components/with-trigger";
import { handleUpdateConfig } from "../actions/updateConfig";
import { ConfigSchema } from "../schemas/configSchema";

interface ConfigDrawerProps {
  config: ConfigSchema;
  status: AppStatus;
  configInstalatorOptions:
    | Record<string, string | Record<string, string>>
    | undefined;
  configInstalatorMeta: Record<string, unknown> | undefined;
}

export const ConfigDrawer = withTrigger<ConfigDrawerProps>((props) => {
  const methods = useForm<Record<string, string>>({
    defaultValues: { ...props.config, ...props.configInstalatorOptions },
  });
  const toast = useToast();

  const availableStrategies = Object.entries(
    props.configInstalatorOptions || {},
  ).filter(([_, opt]) => typeof opt === "object");

  const onSubmit = async (values: Record<string, string>) => {
    handleUpdateConfig(values);
    toast("Configuration updated", true);
    props.handleHide();
  };

  return (
    <>
      <Drawer
        opened={props.isVisible}
        onClose={props.handleHide}
        position="right"
        title="Configuration"
        size="xl"
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
            <Accordion>
              {availableStrategies.map(([key, opt]) => {
                if (typeof opt !== "object") return null;
                const sectionMeta = props.configInstalatorMeta?.[key] as Record<
                  string,
                  unknown
                >;
                return (
                  <AccordionItem key={key} value={key}>
                    <AccordionControl>{key} strategy</AccordionControl>
                    <AccordionPanel>
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
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>

            <Button type="submit">Save</Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
});
