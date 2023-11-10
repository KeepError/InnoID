import { Accordion, Box, Button, Flex, Text } from "@mantine/core";
import { useAPIRequest } from "../../hooks/apiRequest";
import { getAccessPermissions } from "../../lib/api/modules/profile";
import { fieldsMap, links } from "../../consts";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Permissions(): JSX.Element {
  return (
    <Box>
      <AppsPermissions />
    </Box>
  );
}

function AppsPermissions(): JSX.Element {
  const { data, error, loading, call } = useAPIRequest(getAccessPermissions);
  useEffect(() => {
    call();
  }, []);
  let apps = <></>;
  if (data) {
    if (data.app_permissions.length === 0) {
      apps = (
        <Text mt={4} size={"md"} opacity={0.7}>
          Apps will appear here when you provide them access to your data
        </Text>
      );
    } else {
      apps = (
        <Accordion mt={20} variant="separated" chevronPosition="left">
          {data.app_permissions.map((app_permission) => (
            <Accordion.Item
              key={app_permission.app.app_id}
              value={app_permission.app.app_id}
            >
              <Accordion.Control px={16} m={0}>
                <Text weight={500} opacity={1} size={"md"}>
                  {app_permission.app.name}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                {app_permission.fields.map((field) => (
                  <Flex key={app_permission.app.app_id + field} align={"center"} mb={4}>
                    <Flex opacity={0.7}>{fieldsMap[field].icon}</Flex>
                    <Box ml={12}>
                      <Text size={"md"} opacity={0.7}>
                        {fieldsMap[field].name}
                      </Text>
                    </Box>
                  </Flex>
                ))}
                <Button
                  component={Link}
                  to={links.accountRevokePermissions + "?app=" + app_permission.app.app_id}
                  mt={8}
                  variant="outline"
                  color="red"
                >
                  Revoke access
                </Button>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      );
    }
  }
  return (
    <Box>
      <Text weight={600} size={"lg"} mt={4}>
        Apps with access to your data
      </Text>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        apps
      )}
    </Box>
  );
}
