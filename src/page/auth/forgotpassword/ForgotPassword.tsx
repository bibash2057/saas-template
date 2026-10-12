import * as React from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormInput from "@/components/common/FormInput";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { Link } from "react-router";

const createSchema = (t: TFunction<"validation">) =>
  z.object({
    email: z.string().min(1, t("email.required")).email(t("email.invalid")),
  });

type ForgotPasswordValues = z.infer<ReturnType<typeof createSchema>>;

const ForgotPassword = () => {
  const { t } = useTranslation("auth");
  const { t: tValidation } = useTranslation("validation");
  const schema = React.useMemo(() => createSchema(tValidation), [tValidation]);
  const [sentTo, setSentTo] = React.useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  useRevalidateOnLanguageChange(form);

  const onSubmit = async (values: ForgotPasswordValues) => {
    console.log(values);
    setSentTo(values.email);
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <img
          src="https://i.pinimg.com/1200x/4f/a9/6e/4fa96eef37a7707f7dcd08a21b07122f.jpg"
          alt={t("carousel.logoAlt")}
          className="mx-auto size-24"
        />

        {sentTo ? (
          <div className="space-y-6 text-center">
            <MailCheck className="mx-auto size-10 text-primary" />
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("forgot.sentTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                <Trans
                  ns="auth"
                  i18nKey="forgot.sentMessage"
                  values={{ email: sentTo }}
                  components={{
                    email: <span className="font-medium text-foreground" />,
                  }}
                />
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setSentTo(null)}
            >
              {t("forgot.useDifferent")}
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("forgot.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("forgot.subtitle")}
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
                <FormInput
                  control={form.control}
                  name="email"
                  label={t("fields.email.label")}
                  type="email"
                  placeholder={t("fields.email.placeholder")}
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="animate-spin" />
                  )}
                  {t("forgot.submit")}
                </Button>
              </FieldGroup>
            </form>
          </>
        )}

        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-4" />
          {t("forgot.backToLogin")}
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
