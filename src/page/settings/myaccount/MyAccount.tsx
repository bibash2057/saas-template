import Profile from "./component/Profile";
import ChangePassword from "./component/ChangePassword";
import { PageHeader } from "#components/common/PageHeader";
import { useTranslation } from "react-i18next";

const MyAccount = () => {
  const { t } = useTranslation("settings");
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <PageHeader
        title={t("myAccount.title")}
        description={t("myAccount.description")}
      />
      <Profile />
      <ChangePassword />
    </div>
  );
};

export default MyAccount;
