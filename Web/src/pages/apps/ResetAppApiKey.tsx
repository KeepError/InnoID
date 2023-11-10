import { getApp, resetAppApiKey } from "../../lib/api/modules/apps";
import { useAPIRequest } from "../../hooks/apiRequest";
import { Link, useSearchParams } from "react-router-dom";
import ContentBox from "../../components/CardBox";
import { Flex, Text, Button, Box, CopyButton, Tooltip, ActionIcon, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconArrowLeft, IconCheck, IconCopy } from "@tabler/icons-react";
import { links } from "../../consts";

export default function ResetAppApiKey(): JSX.Element {
  const [searchParams] = useSearchParams();
  if (!searchParams.has("app")) {
    return <div>Waiting...</div>;
  }
  const app_id = searchParams.get("app") || "";
  const getAppRequest = useAPIRequest(getApp);
  const resetAppApiKeyRequest = useAPIRequest(resetAppApiKey);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getAppRequest.call(app_id);
  }, []);

  if (refreshing === true && !resetAppApiKeyRequest.loading) {
    if (!resetAppApiKeyRequest.data) {
      return <div>Error...</div>;
    }
    const api_key = resetAppApiKeyRequest.data.api_key;
    return (
      <ContentBox>
        <Box m={12}>
          <Text size={"lg"} align="center" mt={8}>
            API key reset
          </Text>
          <TextInput
            contentEditable={false}
            value={api_key}
            label="API key"
            description="save it, you won't be able to see it again since it's hashed"
            rightSection={
              <CopyButton value={api_key} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "brand" : "gray"}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            }
          />
          <Button
            mt={12}
            variant="outline"
            opacity={0.8}
            leftIcon={<IconArrowLeft />}
            component={Link}
            to={links.accountDevelop}
          >
            Return to apps
          </Button>
        </Box>
      </ContentBox>
    );
  }

  if (getAppRequest.loading) {
    return <div>Loading...</div>;
  }
  if (getAppRequest.data) {
    const app = getAppRequest.data.app;
    return (
      <ContentBox>
        <Text mt={12} size={"xl"} align="center" weight={600}>
          Reset API key
        </Text>
        <Text align="center" opacity={0.7}>
          Do you want to reset an API key for{" "}
          <Text weight={600} span>
            {app.name}
          </Text>
          ?
        </Text>
        <Text align="center" opacity={0.7}>
          This action cannot be undone.
        </Text>
        <Flex mt={24} mb={18} mx={12} gap={24} justify={"space-between"}>
          <Button
            onClick={() => {
              setRefreshing(true);
              resetAppApiKeyRequest.call(app_id);
            }}
            variant="outline"
            color="red"
            fullWidth
            loading={resetAppApiKeyRequest.loading}
          >
            Yes, reset API key
          </Button>
          <Button
            variant="light"
            fullWidth
            component={Link}
            to={links.accountDevelop}
          >
            No, return
          </Button>
        </Flex>
      </ContentBox>
    );
  }
  return <div>Error...</div>;
}
