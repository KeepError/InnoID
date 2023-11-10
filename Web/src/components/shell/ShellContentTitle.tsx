import { Text } from "@mantine/core";

interface ShellContentTitleProps {
  title: string;
}

export default function ShellContentTitle({
  title,
}: ShellContentTitleProps): JSX.Element {
  return (
    <Text weight={700} opacity={0.7} size={"md"} px={8} pb={12}>
      {title}
    </Text>
  );
}
