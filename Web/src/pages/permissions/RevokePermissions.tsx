import { getApp } from "../../lib/api/modules/apps";
import { removeAccessPermissions } from "../../lib/api/modules/profile";
import { useAPIRequest } from "../../hooks/apiRequest";
import { Link, useSearchParams } from "react-router-dom";
import ContentBox from "../../components/CardBox";
import { Flex, Text, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { links } from "../../consts";

export default function RevokePermissions(): JSX.Element {
  const [searchParams] = useSearchParams();
  if (!searchParams.has("app")) {
    return <div>Waiting...</div>;
  }
  const app_id = searchParams.get("app") || "";
  const getAppRequest = useAPIRequest(getApp);
  const removeAccessPermissionsRequest = useAPIRequest(removeAccessPermissions);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  useEffect(() => {
    getAppRequest.call(app_id);
  }, []);

  if (confirmed === true) {
    if (removeAccessPermissionsRequest.error) {
      return <div>Error...</div>;
    }
    return (
      <ContentBox>
        <Flex direction={"column"} align={"center"}>
          <Text size={"lg"} align="center" mt={8}>
            Access Revoked
          </Text>
          <Button
            mt={12}
            mb={8}
            opacity={0.8}
            mx={"auto"}
            variant="outline"
            leftIcon={<IconArrowLeft />}
            component={Link}
            to={links.accountPermissions}
          >
            Return to Permissions tab
          </Button>
        </Flex>
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
          Revoke access
        </Text>
        <Text align="center" opacity={0.7}>
          Do you want to revoke access to your data for{" "}
          <Text weight={600} span>
            {app.name}
          </Text>
          ?
        </Text>
        <Flex mt={24} mb={18} mx={12} gap={24} justify={"space-between"}>
          <Button
            onClick={() => {
              setConfirmed(true);
              removeAccessPermissionsRequest.call(app_id);
            }}
            variant="outline"
            color="red"
            fullWidth
          >
            Yes, revoke access
          </Button>
          <Button
            variant="light"
            fullWidth
            component={Link}
            to={links.accountPermissions}
          >
            No, return
          </Button>
        </Flex>
      </ContentBox>
    );
  }
  return <div>Error...</div>;
}
