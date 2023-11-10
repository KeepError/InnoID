import {
  getApp,
  updateApp,
} from "../../lib/api/modules/apps";
import { useAPIRequest } from "../../hooks/apiRequest";
import ContentBox from "../../components/CardBox";
import {
  Text,
  Box,
  Button,
  TextInput,
  Flex,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useSearchParams } from "react-router-dom";
import { links } from "../../consts";

export default function EditApp(): JSX.Element {
  const [searchParams] = useSearchParams();
  if (!searchParams.has("app")) {
    return <div>Waiting...</div>;
  }
  const app_id = searchParams.get("app") || "";
  const getAppRequest = useAPIRequest(getApp);
  const updateAppRequest = useAPIRequest(updateApp);
  const [updating, setUpdating] = useState<boolean>(false);
  const [appNameValue, setAppNameValue] = useState<string>("");
  const [appNameError, setAppNameError] = useState<string | null>(null);

  useEffect(() => {
    getAppRequest.call(app_id);
  }, []);

  if (updating === true && !updateAppRequest.loading) {
    if (updateAppRequest.error) {
        return <div>Error...</div>;
      }
      return (
        <ContentBox>
          <Flex direction={"column"} align={"center"}>
            <Text size={"lg"} align="center" mt={8}>
              App updated
            </Text>
            <Button
              mt={12}
              mb={8}
              opacity={0.8}
              mx={"auto"}
              variant="outline"
              leftIcon={<IconArrowLeft />}
              component={Link}
              to={links.accountDevelop}
            >
              Return to apps
            </Button>
          </Flex>
        </ContentBox>
      );
  }

  if (getAppRequest.loading) {
    return <div>Loading...</div>;
  }

  if (getAppRequest.data) {
    return (
      <ContentBox>
        <Box m={12}>
          <Text size={"lg"} align="center" my={8}>
          Update app <Text weight={600} span>{getAppRequest.data.app.name}</Text>
        </Text>
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
              updateAppRequest.call(app_id, appNameValue);
              setUpdating(true);
            }}
            variant="outline"
            mt={12}
            fullWidth
            loading={updateAppRequest.loading}
          >
            Update app
          </Button>
        </Box>
      </ContentBox>
    );
  }
  return <div>Error...</div>;
}
