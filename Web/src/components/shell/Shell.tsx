import { Container, Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";


interface ShellProps {
  children: React.ReactNode;
  navSection: React.ReactNode;
}

export default function Shell({ children, navSection }: ShellProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <Container py={12}>
      <Grid>
        <Grid.Col span={isMobile ? 12 : 4}>{navSection}</Grid.Col>
        <Grid.Col span={isMobile ? 12 : 8}>{children}</Grid.Col>
      </Grid>
    </Container>
  );
}
