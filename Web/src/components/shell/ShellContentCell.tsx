import { Box, Flex, Text } from "@mantine/core";

interface ShellContentCellProps {
  icon: JSX.Element;
  title: string;
  value: any;
  last?: boolean;
}

export default function ShellContentCell({
  icon,
  title,
  value,
}: ShellContentCellProps): JSX.Element {
  return (
    <Flex align={"center"} mb={12}>
      <Flex ml={12} opacity={0.7}>
        {icon}
      </Flex>
      <Box ml={12}>
        <Text size={"sm"}>{title}</Text>
        <Text size={"sm"} opacity={0.7}>
          {value}
        </Text>
      </Box>
    </Flex>
  );
}
