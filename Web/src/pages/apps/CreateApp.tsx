import { createApp } from "../../lib/api/modules/apps";
import { useAPIRequest } from "../../hooks/apiRequest";
import ContentBox from "../../components/CardBox";
import {
  Text,
  Box,
  Button,
  TextInput,
  CopyButton,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useState } from "react";
import { IconArrowLeft, IconCheck, IconCopy } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { links } from "../../consts";

export default function CreateApp(): JSX.Element {
  const createAppRequest = useAPIRequest(createApp);
  const [creating, setCreating] = useState<boolean>(false);
  const [appNameValue, setAppNameValue] = useState<string>("");
  const [appNameError, setAppNameError] = useState<string | null>(null);

  if (creating === true && !createAppRequest.loading) {
    if (!createAppRequest.data) {
      return <div>Error...</div>;
    }
    const api_key = createAppRequest.data.api_key;
    return (
      <ContentBox>
        <Box m={12}>
          <Text size={"lg"} align="center" mt={8}>
            App Created
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

  return (
    <ContentBox>
      <Box m={12}>
        {/* <Text size={"lg"} weight={600} align="center" mt={8}>
          Create App
        </Text> */}
        <TextInput
          placeholder="App name"
          label="Enter app name"
          error={appNameError}
          onChange={(event) => {
            setAppNameValue(event.currentTarget.value);
            setAppNameError(null);
          }}
        />
        <Button
          onClick={() => {
            if (appNameValue.length < 3) {
              setAppNameError("App name must be at least 3 characters long");
              return;
            }
            if (appNameValue.length > 20) {
              setAppNameError("App name must be at most 20 characters long");
              return;
            }
            createAppRequest.call(appNameValue);
            setCreating(true);
          }}
          variant="outline"
          mt={12}
          fullWidth
          loading={createAppRequest.loading}
        >
          Create app
        </Button>
      </Box>
    </ContentBox>
  );
}
