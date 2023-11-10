import "./App.css";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import UserLayout from "./components/UserLayout";
import Login from "./pages/Login";
import LoginHandler from "./pages/SSOLoginHandle";
import Profile from "./pages/user/Profile";
import ConnectTelegram from "./pages/connections/ConnectTelegram";
import UserShell from "./components/UserShell";
import DisconnectTelegram from "./pages/connections/DisconnectTelegram";
import ProvidePermissions from "./pages/permissions/ProvidePermissions";
import Permissions from "./pages/user/Permissions";
import RevokePermissions from "./pages/permissions/RevokePermissions";
import Develop from "./pages/user/Develop";
import CreateApp from "./pages/apps/CreateApp";
import ResetAppApiKey from "./pages/apps/ResetAppApiKey";
import EditApp from "./pages/apps/EditApp";
import DeleteApp from "./pages/apps/DeleteApp";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import RedirectAuth from "./pages/redirect/Auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="" element={<UserLayout />}>
        <Route path="r/auth" element={<RedirectAuth />} />
        <Route path="a">
          <Route path="" element={<UserShell />}>
            <Route path="profile" element={<Profile />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="develop" element={<Develop />} />
          </Route>
          <Route path="connect/telegram" element={<ConnectTelegram />} />
          <Route path="disconnect/telegram" element={<DisconnectTelegram />} />
          <Route path="provide-permissions" element={<ProvidePermissions />} />
          <Route path="revoke-permissions" element={<RevokePermissions />} />
          <Route path="create-app" element={<CreateApp />} />
          <Route path="edit-app" element={<EditApp />} />
          <Route path="delete-app" element={<DeleteApp />} />
          <Route path="reset-app-api-key" element={<ResetAppApiKey />} />
        </Route>
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="login/sso/callback" element={<LoginHandler />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
