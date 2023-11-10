import { useNavigate, useSearchParams } from "react-router-dom";
import { getSafeCurrentPath } from "../../lib/utils";
import { links } from "../../consts";
import { useEffect, useState } from "react";
import { useAPIRequest } from "../../hooks/apiRequest";
import {
  getAccessPermissions,
  getUserTelegramConnection,
} from "../../lib/api/modules/profile";

export default function RedirectAuth(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const getAccessPermissionsRequest = useAPIRequest(getAccessPermissions);
  const getUserTelegramConnectionRequest = useAPIRequest(
    getUserTelegramConnection
  );
  // useEffect(() => {
  //   getAccessPermissionsRequest.call();
  //   getUserTelegramConnectionRequest.call();
  // }, []);
  const [checkAppPermissions, setCheckAppPermissions] = useState(false);
  const [checkTelegramConnection, setCheckTelegramConnection] = useState(false);
  const [checkRedirect, setCheckRedirect] = useState(false);
  const [checkElse, setCheckElse] = useState(false);

  const appId = searchParams.get("app");
  const scope = searchParams.get("scope");
  const connect = searchParams.get("connect");
  const redirect = searchParams.get("redirect");

  const currentPath = getSafeCurrentPath();

  useEffect(() => {
    if (appId) {
      setCheckAppPermissions(true);
    }
  }, []);
  // if (appId) {
  //   setCheckAppPermissions(true);
  // }

  console.log(checkAppPermissions);

  useEffect(() => {
    if (!checkAppPermissions) return;
    if (!scope) {
      setCheckTelegramConnection(true);
      return;
    }
    if (
      getAccessPermissionsRequest.loading ||
      getAccessPermissionsRequest.error
    )
      return;
    if (
      !getAccessPermissionsRequest.loading &&
      !(getAccessPermissionsRequest.data || getAccessPermissionsRequest.error)
    ) {
      getAccessPermissionsRequest.call();
      return;
    }
    const fields = scope!.split(" ");
    if (
      getAccessPermissionsRequest.data!.app_permissions.some((permission) => {
        console.log(permission);
        console.log(permission.fields);
        console.log(permission.app.app_id == appId);
        return (
          permission.app.app_id == appId &&
          fields.every((field) => permission.fields.includes(field))
        );
      })
    ) {
      setCheckTelegramConnection(true);
      return;
    }
    navigate(
      links.accountProvidePermissions +
        `?app=${appId}&fields=${scope}&fromPath=${currentPath}`,
      { replace: true }
    );
  }, [checkAppPermissions, getAccessPermissionsRequest.loading]);

  useEffect(() => {
    if (!checkTelegramConnection) return;
    if (connect !== "telegram") {
      setCheckRedirect(true);
      return;
    }
    if (getUserTelegramConnectionRequest.loading) return;
    if (
      !getUserTelegramConnectionRequest.loading &&
      !(
        getUserTelegramConnectionRequest.data ||
        getUserTelegramConnectionRequest.error
      )
    ) {
      getUserTelegramConnectionRequest.call();
      return;
    }
    if (getUserTelegramConnectionRequest.data) {
      setCheckRedirect(true);
      return;
    }
    navigate(
      links.accountConnectTelegram +
        `?app=${appId}` +
        (redirect ? `&redirect=${redirect}` : ""),
      { replace: true }
    );
  }, [checkTelegramConnection, getUserTelegramConnectionRequest.loading]);

  useEffect(() => {
    if (!checkRedirect) return;
    if (!redirect) {
      setCheckElse(true);
      return;
    }
    window.location.href = redirect;
  }, [checkRedirect]);

  useEffect(() => {
    if (!checkElse) return;
    navigate(links.accountProfile);
  }, [checkElse]);

  // useEffect(() => {
  //   if (!appId) {
  //     return;
  //   }

  //   if (scope) {
  //     if (
  //       !getAccessPermissionsRequest.loading &&
  //       !(getAccessPermissionsRequest.data || getAccessPermissionsRequest.error)
  //     ) {
  //       getAccessPermissionsRequest.call();
  //       return;
  //     }

  //     const fields = scope.split(" ");

  //     if (getAccessPermissionsRequest.data) {
  //       if (getAccessPermissionsRequest.data?.app_permissions.some((permission) => {
  //         console.log(permission);
  //         console.log(permission.fields);
  //         console.log(permission.app.app_id == appId);
  //         return (
  //           permission.app.app_id == appId &&
  //           fields.every((field) => permission.fields.includes(field))
  //         );
  //       }))
  //     }
  //   }

  //   // if (
  //   //   scope &&
  //   //   !getAccessPermissionsRequest.loading &&
  //   //   !(getAccessPermissionsRequest.data || getAccessPermissionsRequest.error)
  //   // ) {
  //   //   getAccessPermissionsRequest.call();
  //   //   return;
  //   // }

  //   let arePermissionsRequired = false;
  //   if (scope) {
  //     arePermissionsRequired = true;
  //     const fields = scope.split(" ");
  //     if (
  //       getAccessPermissionsRequest.data?.app_permissions.some((permission) => {
  //         console.log(permission);
  //         console.log(permission.fields);
  //         console.log(permission.app.app_id == appId);
  //         return (
  //           permission.app.app_id == appId &&
  //           fields.every((field) => permission.fields.includes(field))
  //         );
  //       })
  //     ) {
  //       arePermissionsRequired = false;
  //     }
  //   }

  //   if (arePermissionsRequired) {
  //     navigate(
  //       links.accountProvidePermissions +
  //         `?app=${appId}&fields=${scope}&fromPath=${currentPath}`,
  //       { replace: true }
  //     );
  //     return;
  //   }

  //   if (
  //     connect === "telegram" &&
  //     !getUserTelegramConnectionRequest.error &&
  //     !(
  //       getUserTelegramConnectionRequest.data ||
  //       getUserTelegramConnectionRequest.error
  //     )
  //   ) {
  //     getUserTelegramConnectionRequest.call();
  //     return;
  //   }
  //   let isTelegramConnectionRequired = false;
  //   if (connect === "telegram" && getUserTelegramConnectionRequest.error) {
  //     isTelegramConnectionRequired = true;
  //   }
  //   if (isTelegramConnectionRequired) {
  //     navigate(
  //       links.accountConnectTelegram +
  //         `?app=${appId}` +
  //         (redirect ? `&redirect=${redirect}` : ""),
  //       { replace: true }
  //     );
  //   } else if (redirect) {
  //     window.location.href = redirect;
  //   } else {
  //     navigate(links.accountProfile);
  //   }
  // }, [
  //   getAccessPermissionsRequest.loading,
  //   getUserTelegramConnectionRequest.loading,
  // ]);

  // if (!appId) {
  //   return <div>App not provided</div>;
  // }

  // console.log("Permissions: ", getAccessPermissionsRequest);
  // console.log("Telegram: ", getUserTelegramConnectionRequest);
  // console.log("====================================");

  // if (
  //   !getAccessPermissionsRequest.data ||
  //   !(
  //     getUserTelegramConnectionRequest.data ||
  //     getUserTelegramConnectionRequest.error
  //   )
  // ) {
  //   return <div>Loading...</div>;
  // }

  // if (getAccessPermissionsRequest.error) {
  //   return <div>Error</div>;
  // }

  // let arePermissionsRequired = false;
  // if (scope) {
  //   arePermissionsRequired = true;
  //   const fields = scope.split(" ");
  //   if (
  //     getAccessPermissionsRequest.data?.app_permissions.some((permission) => {
  //       console.log(permission);
  //       console.log(permission.fields);
  //       console.log(permission.app.app_id == appId);
  //       return (
  //         permission.app.app_id == appId &&
  //         fields.every((field) => permission.fields.includes(field))
  //       );
  //     })
  //   ) {
  //     arePermissionsRequired = false;
  //   }
  // }

  // console.log(arePermissionsRequired);

  // const isTelegramConnectionRequired() => {

  // }

  // let isTelegramConnectionRequired = false;
  // if (connect === "telegram" && getUserTelegramConnectionRequest.error) {
  //   isTelegramConnectionRequired = true;
  // }

  // const currentPath = getSafeCurrentPath();
  // console.log(currentPath);

  return <div>Redirecting...</div>;
}
