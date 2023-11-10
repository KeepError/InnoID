import { Box, Button, Flex, Image, Text } from "@mantine/core";
import innoidCircleLogo from "../assets/innoid_circle.svg";
import { Link } from "react-router-dom";
import { links } from "../consts";

export default function Home() {
  return (
    <Box>
      <Flex align={"center"} justify={"space-evenly"} h={"100vh"}>
        <Box>
          <Text size={100} weight={600} opacity={0.5}>This is</Text>
          <Text weight={600} size={128}>InnoID</Text>
          <Button size={"xl"} variant="outline" component={Link} to={links.login} mr={40}>My account</Button>
          <Button size={"xl"} variant="outline" component={Link} to={links.home}>Developer's guide</Button>
        </Box>
        <Image src={innoidCircleLogo} height={400} width={400} alt="InnoID" fit="contain" />
      </Flex>
    </Box>
  );
}
