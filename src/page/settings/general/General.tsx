import { useTranslation } from "react-i18next";
import Appearance from "./component/Appearance";
import { PageHeader } from "#components/common/PageHeader";
import CalendarSettings from "./component/CalendarSettings";
import CurrencySettings from "./component/CurrencySettings";
import LanguageSettings from "./component/LanguageSettings";

const General = () => {
  const { t } = useTranslation("settings");
  return (
    <div className="space-y-4">
      <PageHeader title={t("general.title")} />
      <Appearance />
      <LanguageSettings />
      <CurrencySettings />
      <CalendarSettings />
    </div>
  );
};

export default General;
