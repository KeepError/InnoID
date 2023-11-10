import { Paper, Container } from "@mantine/core";

interface ShellContentBoxProps {
  children: React.ReactNode;
  // title?: string;
  // subtitle?: string;
}

export default function ContentBox({
  children,
}: ShellContentBoxProps): JSX.Element {
  return (
    <Container maw={512} mt={64}>
    <Paper p={12} bg={"gray.9"} radius={"md"} withBorder mb={12}>
      {children}
    </Paper>
    </Container>
  );
}
