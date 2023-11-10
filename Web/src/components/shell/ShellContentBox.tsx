import { Paper } from "@mantine/core";

interface ShellContentBoxProps {
  children: React.ReactNode;
  // title?: string;
  // subtitle?: string;
}

export default function ShellContentBox({
  children,
  // title,
  // subtitle,
}: ShellContentBoxProps): JSX.Element {
  return (
    <Paper p={12} bg={"gray.9"} radius={"md"} withBorder mb={12}>
      {/* <Box mb={12}>
        <Text>{title}</Text>
        <Text size={"sm"} opacity={0.7}>
          {subtitle}
        </Text>
      </Box> */}
      {children}
    </Paper>
  );
}
