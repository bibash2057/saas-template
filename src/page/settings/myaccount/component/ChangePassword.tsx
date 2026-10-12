import { z } from "zod";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/common/FormInput";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import type { TFunction } from "i18next";

const createPasswordSchema = (t: TFunction<"validation">) =>
  z
    .object({
      currentPassword: z.string().min(1, t("password.current_required")),
      newPassword: z
        .string()
        .min(1, t("password.required"))
        .min(8, t("password.min_other", { count: 8 })),
      confirmPassword: z.string().min(1, t("confirmPassword.confirm_new")),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t("password.mismatch"),
      path: ["confirmPassword"],
    })
    .refine((d) => d.newPassword !== d.currentPassword, {
      message: t("password.must_be_different"),
      path: ["newPassword"],
    });

type PasswordValues = z.infer<ReturnType<typeof createPasswordSchema>>;

const ChangePassword = () => {
  const { t } = useTranslation("settings");
  const { t: tValidation } = useTranslation("validation");
  const passwordSchema = useMemo(
    () => createPasswordSchema(tValidation),
    [tValidation],
  );

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onChangePassword = async (values: PasswordValues) => {
    console.log(values);
    passwordForm.reset();
  };

  const { isDirty: passwordDirty, isSubmitting: passwordSaving } =
    passwordForm.formState;

  return (
    <>
      <Card>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} noValidate>
          <CardHeader>
            <CardTitle>{t("myAccount.changePassword.title")}</CardTitle>
            <CardDescription>
              {t("myAccount.changePassword.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-6">
            <FieldGroup>
              <FormInput
                control={passwordForm.control}
                name="currentPassword"
                label={t("myAccount.changePassword.confirmPassword")}
                type="password"
                placeholder={t(
                  "myAccount.changePassword.confirmPasswordPlaceholder",
                )}
                autoComplete="current-password"
              />
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  control={passwordForm.control}
                  name="newPassword"
                  label={t("myAccount.changePassword.newPassword")}
                  type="password"
                  placeholder={t(
                    "myAccount.changePassword.newPasswordPlaceholder",
                  )}
                  autoComplete="new-password"
                />
                <FormInput
                  control={passwordForm.control}
                  name="confirmPassword"
                  label={t("myAccount.changePassword.confirmPassword")}
                  type="password"
                  placeholder={t(
                    "myAccount.changePassword.confirmPasswordPlaceholder",
                  )}
                  autoComplete="new-password"
                />
              </div>
            </FieldGroup>
          </CardContent>

          <CardFooter className="mt-6 justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!passwordDirty || passwordSaving}
              onClick={() => passwordForm.reset()}
            >
              {t("myAccount.changePassword.clear")}
            </Button>
            <Button type="submit" disabled={!passwordDirty || passwordSaving}>
              {passwordSaving && <Loader2 className="animate-spin" />}
              {t("myAccount.changePassword.updatePassword")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default ChangePassword;
