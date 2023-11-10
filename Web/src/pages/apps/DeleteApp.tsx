import { getApp, deleteApp } from "../../lib/api/modules/apps";
import { useAPIRequest } from "../../hooks/apiRequest";
import { Link, useSearchParams } from "react-router-dom";
import ContentBox from "../../components/CardBox";
import { Flex, Text, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { links } from "../../consts";

export default function DeleteApp(): JSX.Element {
  const [searchParams] = useSearchParams();
  if (!searchParams.has("app")) {
    return <div>Waiting...</div>;
  }
  const app_id = searchParams.get("app") || "";
  const getAppRequest = useAPIRequest(getApp);
  const deleteAppRequest = useAPIRequest(deleteApp);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    getAppRequest.call(app_id);
  }, []);

  if (deleting === true && !deleteAppRequest.loading) {
    if (deleteAppRequest.error) {
      return <div>Error...</div>;
    }
    return (
      <ContentBox>
        <Flex direction={"column"} align={"center"}>
          <Text size={"lg"} align="center" mt={8}>
            App deleted
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
    const app = getAppRequest.data.app;
    return (
      <ContentBox>
        <Text mt={12} size={"xl"} align="center" weight={600}>
          Delete app
        </Text>
        <Text align="center" opacity={0.7}>
          Do you want to delete app{" "}
          <Text weight={600} span>
            {app.name}
          </Text>
          ?
        </Text>
        <Flex mt={24} mb={18} mx={12} gap={24} justify={"space-between"}>
          <Button
            onClick={() => {
              setDeleting(true);
              deleteAppRequest.call(app_id);
            }}
            variant="outline"
            color="red"
            fullWidth
            loading={deleteAppRequest.loading}
          >
            Yes, delete app
          </Button>
          <Button variant="light" fullWidth component={Link} to={links.accountDevelop}>
            No, return
          </Button>
        </Flex>
      </ContentBox>
    );
  }
  return <div>Error...</div>;
}
