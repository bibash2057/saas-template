import { Trans } from "react-i18next";
import { cn } from "cn";
import { Link } from "react-router";

type TermsNoticeProps = {
  action?: "continuing" | "signingUp";
  termsHref?: string;
  privacyHref?: string;
  className?: string;
};

const linkClass = "underline underline-offset-4 hover:text-foreground";

const TermsNotice = ({
  action = "continuing",
  termsHref = "/terms",
  privacyHref = "/privacy",
  className,
}: TermsNoticeProps) => {
  return (
    <p className={cn("text-center text-xs text-muted-foreground", className)}>
      <Trans
        ns="auth"
        i18nKey={`terms.${action}`}
        components={{
          terms: <Link to={termsHref} className={linkClass} />,
          privacy: <Link to={privacyHref} className={linkClass} />,
        }}
      />
    </p>
  );
};

export default TermsNotice;
