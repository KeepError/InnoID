import { Link } from "react-router-dom";
import { useUserContext } from "../../hooks/userContext";
import { Box, Flex, Button } from "@mantine/core";
import ShellContentBox from "../../components/shell/ShellContentBox";
import {
  IconBrandTelegram,
} from "@tabler/icons-react";
import ShellContentCell from "../../components/shell/ShellContentCell";
import ShellContentTitle from "../../components/shell/ShellContentTitle";
import { useAPIRequest } from "../../hooks/apiRequest";
import { getUserTelegramConnection } from "../../lib/api/modules/profile";
import { fieldsMap, links } from "../../consts";
import { useEffect } from "react";

export default function Profile(): JSX.Element {
  return (
    <Box>
      <PersonalData />
      <Connections />
    </Box>
  );
}

function PersonalData(): JSX.Element {
  const { user } = useUserContext();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ShellContentBox>
      <Box mt={12}>
        {Object.keys(fieldsMap).map(
          (field) =>
            user.hasOwnProperty(field) && (
              <ShellContentCell
                key={field}
                icon={fieldsMap[field].icon}
                title={fieldsMap[field].name}
                value={user[field]}
              />
            )
        )}
      </Box>
    </ShellContentBox>
  );
}

function Connections(): JSX.Element {
  const {loading, data, call} = useAPIRequest(getUserTelegramConnection);
  useEffect(() => {
    call();
  }, []);
  return (
    <>
      <ShellContentBox>
        <ShellContentTitle title="Connections" />
        {!loading && (
          <ConnectionCell
            title="Telegram"
            icon={<IconBrandTelegram size={32} />}
            data={
              data ? (data.telegram_username ? `@${data.telegram_username}` : `ID: ${data.telegram_id}`) : ""
            }
            isConnected={Boolean(data)}
            connectURL={links.accountConnectTelegram}
            disconnectURL={links.accountDisconnectTelegram}
          />
        )}
      </ShellContentBox>
    </>
  );
}

function ConnectionCell({
  title,
  icon,
  data: userData,
  isConnected,
  connectURL,
  disconnectURL,
}: {
  title: string;
  icon: JSX.Element;
  data: string;
  isConnected: boolean;
  connectURL: string;
  disconnectURL: string;
}): JSX.Element {
  return (
    <Flex justify={"space-between"}>
      <ShellContentCell
        icon={icon}
        title={title}
        value={isConnected ? userData : "Not connected"}
      />
      <Button
        variant="outline"
        mr={12}
        color={isConnected ? "red" : "brand"}
        component={Link}
        to={isConnected ? disconnectURL : connectURL}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
    </Flex>
  );
}
