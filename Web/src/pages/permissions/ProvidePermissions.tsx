import { getApp } from "../../lib/api/modules/apps";
import { addAccessPermissions } from "../../lib/api/modules/profile";
import { useAPIRequest } from "../../hooks/apiRequest";
import { useNavigate, useSearchParams } from "react-router-dom";
import ContentBox from "../../components/CardBox";
import { Flex, Text, Box, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { fieldsMap } from "../../consts";

export default function ProvidePermissions(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!(searchParams.has("app") && searchParams.has("fields"))) {
    return <div>Waiting...</div>;
  }
  const app_id = searchParams.get("app") || "";
  const fieldsParam = searchParams.get("fields") || "";
  const fields = fieldsParam.split(" ");
  for (const field of fields) {
    if (!fieldsMap[field]) {
      return <div>Invalid field</div>;
    }
  }
  const getAppRequest = useAPIRequest(getApp);
  const addAccessPermissionsRequest = useAPIRequest(addAccessPermissions);
  const [status, setStatus] = useState<boolean | null>(null);

  useEffect(() => {
    getAppRequest.call(app_id);
  }, []);

  if (status === true) {
    if (addAccessPermissionsRequest.error) {
      return <div>Error...</div>;
    }
    const fromPath = searchParams.get("fromPath");
    if (fromPath) {
      navigate(fromPath, { replace: true });
    }
    return (
      <ContentBox>
        <Text size={"lg"} align="center" mt={8}>
          Access Granted
        </Text>
        <Text align="center" mt={12} mb={8} opacity={0.7}>
          You can now close this window
        </Text>
      </ContentBox>
    );
  }

  if (status === false) {
    return (
      <ContentBox>
        <Text size={"lg"} align="center" mt={8}>
          Access Denied
        </Text>
        <Text align="center" mt={12} mb={8} opacity={0.7}>
          You can now close this window
        </Text>
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
          {app.name}
        </Text>
        <Text align="center" opacity={0.7}>
          wants to access to the following fields
        </Text>
        {fields.map((field) => (
          <Flex key={field} align={"center"} mt={12}>
            <Flex ml={12} opacity={0.7}>
              {fieldsMap[field].icon}
            </Flex>
            <Box ml={12}>
              <Text size={"md"} weight={600} opacity={0.7}>
                {fieldsMap[field].name}
              </Text>
            </Box>
          </Flex>
        ))}
        <Flex mt={24} mb={18} mx={12} gap={24} justify={"space-between"}>
          <Button
            onClick={() => {
              setStatus(true);
              addAccessPermissionsRequest.call(app_id, fields);
            }}
            variant="light"
            fullWidth
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              setStatus(false);
            }}
            variant="outline"
            color="red"
            fullWidth
          >
            Decline
          </Button>
        </Flex>
      </ContentBox>
    );
  }
  return <div>Error...</div>;
}
