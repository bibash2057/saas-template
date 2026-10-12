import * as React from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormInput from "@/components/common/FormInput";
import TermsNotice from "#components/common/TermsNotice";
import { useRevalidateOnLanguageChange } from "@/hooks/useRevalidateOnLanguageChange";
import { Link } from "react-router";

const createLoginSchema = (t: TFunction<"validation">) =>
  z.object({
    email: z.string().min(1, t("email.required")).email(t("email.invalid")),
    password: z.string().min(1, t("password.required")),
  });

type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;

const slides = [
  {
    image:
      "https://i.pinimg.com/1200x/35/1c/5c/351c5c77cb6af4f4ceaadb8bf3f5a6c4.jpg",

    href: "#",
  },
  {
    image:
      "https://i.pinimg.com/1200x/e9/d1/cb/e9d1cbdcb5197bd657be01a5aa57e9f0.jpg",

    href: "#",
  },
];

const Login = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { t: tValidation } = useTranslation("validation");
  const loginSchema = React.useMemo(
    () => createLoginSchema(tValidation),
    [tValidation],
  );
  const [slideIndex, setSlideIndex] = React.useState(0);
  const slide = slides[slideIndex];
  const prev = () =>
    setSlideIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setSlideIndex((i) => (i + 1) % slides.length);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  useRevalidateOnLanguageChange(form);

  const onSubmit = async (values: LoginValues) => {
    console.log(values);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <aside className="hidden p-4 lg:block">
        <div className="flex h-full flex-col justify-between rounded-2xl bg-muted p-8">
          <div className="space-y-6">
            <div className="aspect-[5/4] w-full overflow-hidden rounded-xl border bg-background">
              <img
                src={slide.image}
                alt={t("carousel.slideAlt")}
                className="h-full w-full object-cover scale-105"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button>
              <Link to={slide.href}>{t("common:actions.learnMore")}</Link>
            </Button>

            {slides.length > 1 && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t("carousel.previous")}
                  onClick={prev}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t("carousel.next")}
                  onClick={next}
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex min-h-svh flex-col">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-6">
              <img
                src="https://i.pinimg.com/1200x/4f/a9/6e/4fa96eef37a7707f7dcd08a21b07122f.jpg"
                alt={t("carousel.logoAlt")}
                className="mx-auto h-32 w-h-32"
              />
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {t("login.title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("login.subtitle")}
                </p>
              </div>
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

                <div className="space-y-2">
                  <FormInput
                    control={form.control}
                    name="password"
                    label={t("fields.password.label")}
                    type="password"
                    placeholder={t("fields.password.placeholder")}
                    autoComplete="current-password"
                  />
                  <Link
                    to="/auth/forgot-password"
                    className="inline-block text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="animate-spin" />
                  )}
                  {t("login.submit")}
                </Button>
              </FieldGroup>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {t("login.needAccount")}{" "}
              <Link
                to="/auth/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {t("login.signUp")}
              </Link>
            </p>
          </div>
        </div>

        <TermsNotice action="continuing" className="px-6 pb-6" />
      </main>
    </div>
  );
};

export default Login;
