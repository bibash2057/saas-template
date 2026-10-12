import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import { ThemeProvider } from "./components/common/theme-provider";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Invoices from "./page/account/invoices/Invoices";
import Login from "./page/auth/login/Login";
import SignUp from "./page/auth/signup/SignUp";
import ForgotPassword from "./page/auth/forgotpassword/ForgotPassword";
import SettingsLayout from "./layout/SettingsLayout";
import General from "./page/settings/general/General";
import MyAccount from "./page/settings/myaccount/MyAccount";
import BusinessProfile from "./page/settings/businessprofile/BusinessProfile";
import Subscription from "./page/settings/subscription/Subscription";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "signup", element: <SignUp /> },
        { path: "forgot-password", element: <ForgotPassword /> },
      ],
    },
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/accounting/sales/invoices", element: <Invoices /> },
        {
          path: "settings",
          element: <SettingsLayout />,
          children: [
            { index: true, element: <Navigate to="general" replace /> },
            { path: "general", element: <General /> },
            { path: "my-account", element: <MyAccount /> },
            { path: "business-profile", element: <BusinessProfile /> },
            { path: "subscription", element: <Subscription /> },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
};

export default App;
