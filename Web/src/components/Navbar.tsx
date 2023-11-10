import {
  Avatar,
  Button,
  Container,
  Flex,
  Group,
  Menu,
  Text,
  Image,
  Divider,
  Box,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import innoidLogo from "../assets/innoid.svg";
import { Link } from "react-router-dom";
import { User } from "../lib/api/entities";
import { links } from "../consts";

interface NavProps {
  user: User;
}

export default function Nav({ user }: NavProps) {
  let leftSection = (
    <Group>
      <Link to={links.accountProfile}>
        <Image src={innoidLogo} height={32} alt="InnoID" fit="contain" />
      </Link>
    </Group>
  );

  let rightSection = <Button>Login</Button>;
  if (user) {
    rightSection = (
      <Menu trigger="hover" position="bottom-end" offset={4}>
        <Menu.Target>
          <Group>
            <Avatar size={36}>EK</Avatar>
          </Group>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Box>
              <Text size={"sm"}>Egor Kuziakov</Text>
              <Text size={"xs"} opacity={0.8}>
                {user.email}
              </Text>
            </Box>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item component={Link} to={links.logout} icon={<IconLogout />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <nav>
      <Box bg={"gray.9"}>
        <Container py={12}>
          <Flex justify={"space-between"} mx={8}>
            {leftSection}
            {rightSection}
          </Flex>
        </Container>
      </Box>
      <Divider opacity={0.5} />
    </nav>
  );
}
