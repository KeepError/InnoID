import {
  IconFaceId,
  IconMail,
  IconSignature,
  IconUsersGroup,
} from "@tabler/icons-react";

interface FieldInfo {
  name: string;
  icon: JSX.Element;
}

export const fieldsMap: Record<string, FieldInfo> = {
  user_id: {
    name: "UserID",
    icon: <IconFaceId size={32} />,
  },
  email: {
    name: "Email",
    icon: <IconMail size={32} />,
  },
  full_name: {
    name: "Full name",
    icon: <IconSignature size={32} />,
  },
  study_group: {
    name: "Study group",
    icon: <IconUsersGroup size={32} />,
  },
};

export const links = {
  home: "/",
  accountProfile: "/a/profile",
  accountPermissions: "/a/permissions",
  accountDevelop: "/a/develop",
  accountConnectTelegram: "/a/connect/telegram",
  accountDisconnectTelegram: "/a/disconnect/telegram",
  accountProvidePermissions: "/a/provide-permissions",
  accountRevokePermissions: "/a/revoke-permissions",
  accountCreateApp: "/a/create-app",
  accountEditApp: "/a/edit-app",
  accountDeleteApp: "/a/delete-app",
  accountResetAppApiKey: "/a/reset-app-api-key",
  login: "/login",
  logout: "/logout",
  loginHandleSSO: "/login/sso/callback",
};
