import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormInput from "@/components/common/FormInput";
import TermsNotice from "#components/common/TermsNotice";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { Link } from "react-router";

const MIN_PASSWORD_LENGTH = 8;

const createSignUpSchema = (t: TFunction<"validation">) =>
  z
    .object({
      name: z.string().min(1, t("name.required")),
      email: z.string().min(1, t("email.required")).email(t("email.invalid")),
      password: z
        .string()
        .min(
          MIN_PASSWORD_LENGTH,
          t("password.min", { count: MIN_PASSWORD_LENGTH }),
        ),
      confirmPassword: z.string().min(1, t("confirmPassword.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("password.mismatch"),
      path: ["confirmPassword"],
    });

type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>;

const SignUp = () => {
  const { t } = useTranslation("auth");
  const { t: tValidation } = useTranslation("validation");
  const signUpSchema = React.useMemo(
    () => createSignUpSchema(tValidation),
    [tValidation],
  );
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  useRevalidateOnLanguageChange(form);

  const onSubmit = async (values: SignUpValues) => {
    console.log(values);
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <img
          src="https://i.pinimg.com/1200x/4f/a9/6e/4fa96eef37a7707f7dcd08a21b07122f.jpg"
          alt={t("carousel.logoAlt")}
          className="mx-auto size-24"
        />

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("signup.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("signup.subtitle")}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FormInput
              control={form.control}
              name="name"
              label={t("fields.name.label")}
              placeholder={t("fields.name.placeholder")}
              autoComplete="name"
            />
            <FormInput
              control={form.control}
              name="email"
              label={t("fields.email.label")}
              type="email"
              placeholder={t("fields.email.placeholder")}
              autoComplete="email"
            />
            <FormInput
              control={form.control}
              name="password"
              label={t("fields.password.label")}
              type="password"
              placeholder={t("fields.password.newPlaceholder")}
              autoComplete="new-password"
            />
            <FormInput
              control={form.control}
              name="confirmPassword"
              label={t("fields.confirmPassword.label")}
              type="password"
              placeholder={t("fields.confirmPassword.placeholder")}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin" />
              )}
              {t("signup.submit")}
            </Button>
          </FieldGroup>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t("signup.haveAccount")}{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("signup.logIn")}
          </Link>
        </p>

        <TermsNotice action="signingUp" />
      </div>
    </div>
  );
};

export default SignUp;
