import { ActionIcon, Box, Button, Flex, Menu, Text } from "@mantine/core";
import ShellContentBox from "../../components/shell/ShellContentBox";
import { useAPIRequest } from "../../hooks/apiRequest";
import { getUserApps } from "../../lib/api/modules/apps";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { IconDots, IconEdit, IconKey, IconTrash } from "@tabler/icons-react";
import { links } from "../../consts";

export default function Develop(): JSX.Element {
  return (
    <Box>
      <UserApps />
    </Box>
  );
}

function UserApps(): JSX.Element {
  const { data, error, loading, call } = useAPIRequest(getUserApps);
  useEffect(() => {
    call();
  }, []);
  let apps = <></>;
  if (data) {
    if (data.apps.length === 0) {
      apps = (
        <Text size={"md"} opacity={0.7}>
          You have not created any apps yet
        </Text>
      );
    } else {
      apps = (
        <>
          {data.apps.map((app) => (
            <ShellContentBox key={app.app_id}>
              <Flex align={"center"} justify={"space-between"}>
                <Box>
                  <Text>{app.name}</Text>
                  <Text size={"sm"} opacity={0.7}>
                    ID: {app.app_id}
                  </Text>
                </Box>
                <Menu>
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      component={Link}
                      to={links.accountResetAppApiKey + "?app=" + app.app_id}
                      icon={<IconKey size={20} />}
                    >
                      Reset API key
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      component={Link}
                      to={links.accountEditApp + "?app=" + app.app_id}
                      icon={<IconEdit size={20} />}
                    >
                      Edit app
                    </Menu.Item>
                    <Menu.Item
                      component={Link}
                      to={links.accountDeleteApp + "?app=" + app.app_id}
                      color="red"
                      icon={<IconTrash size={20} />}
                    >
                      Delete app
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Flex>
            </ShellContentBox>
          ))}
        </>
      );
    }
  }
  return (
    <Box>
      <Flex justify={"space-between"} align={"center"} mt={4} mb={12}>
        <Text weight={600} size={"lg"}>
          Your apps
        </Text>
        <Button
          component={Link}
          to={links.accountCreateApp}
          variant="outline"
          opacity={0.7}
        >
          New app
        </Button>
      </Flex>
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
