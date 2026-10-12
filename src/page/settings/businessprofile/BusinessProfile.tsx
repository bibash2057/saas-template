import { PageHeader } from "#components/common/PageHeader";
import { useTranslation } from "react-i18next";
import BusinessInfoForm from "./component/BusinessInfoForm";

const BusinessProfile = () => {
  const { t } = useTranslation("settings");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <PageHeader
        title={t("businessProfile.title")}
        description={t("businessProfile.description")}
      />
      <BusinessInfoForm />
    </div>
  );
};

export default BusinessProfile;
