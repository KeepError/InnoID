import { NavLink } from "@mantine/core";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface ShellNavLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

export default function ShellNavLink({ icon, label, to }: ShellNavLinkProps) {
  const location = useLocation();
  return (
    <NavLink
      active={location.pathname === to}
      py={12}
      icon={icon}
      label={label}
      style={{ borderRadius: 8 }}
      component={Link}
      to={to}
    />
  );
}
