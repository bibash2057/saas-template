import { z } from "zod";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useMemo, useRef, type ChangeEvent } from "react";
import { FieldGroup } from "@/components/ui/field";
import FormInput from "@/components/common/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const createProfileSchema = (t: TFunction<"validation">) =>
  z.object({
    avatarUrl: z.string().optional(),
    name: z.string().min(1, t("name.required")),
    email: z.string().min(1, t("email.required")).email(t("email.invalid")),
    phone: z.string().optional(),
    address: z.string().optional(),
  });

type ProfileValues = z.infer<ReturnType<typeof createProfileSchema>>;

const Profile = () => {
  const { t } = useTranslation("settings");
  const { t: tValidation } = useTranslation("validation");
  const profileSchema = useMemo(
    () => createProfileSchema(tValidation),
    [tValidation],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatarUrl: "",
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const avatarUrl = profileForm.watch("avatarUrl");
  const nameValue = profileForm.watch("name");

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      profileForm.setValue("avatarUrl", previewUrl, { shouldDirty: true });
    }
  };

  const handleRemoveAvatar = () => {
    profileForm.setValue("avatarUrl", "", { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSaveProfile = async (values: ProfileValues) => {
    console.log("Saving values:", values);
    profileForm.reset(values);
  };

  const { isDirty: profileDirty, isSubmitting: profileSaving } =
    profileForm.formState;

  return (
    <Card>
      <form onSubmit={profileForm.handleSubmit(onSaveProfile)} noValidate>
        <CardHeader>
          <CardTitle>{t("myAccount.profile.title")}</CardTitle>
          <CardDescription>
            {t("myAccount.profile.description")}{" "}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6 space-y-6">
          <div className="flex flex-col items-center sm:items-start gap-3 pb-6 border-b">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
              id="avatar-upload"
            />

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative rounded-full ring-offset-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={t("myAccount.profile.uploadPhoto")}
              >
                <Avatar className="h-24 w-24 border cursor-pointer">
                  <AvatarImage src={avatarUrl} alt={nameValue} />
                  <AvatarFallback className="text-xl font-semibold bg-muted">
                    {getInitials(nameValue)}
                  </AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-6 w-6" />
                  <span className="text-[10px] font-medium mt-0.5">
                    {t("myAccount.profile.upload")}
                  </span>
                </div>
              </button>

              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleRemoveAvatar}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("myAccount.profile.remove")}
                </Button>
              )}
            </div>

            <span className="text-xs text-muted-foreground">
              {t("myAccount.profile.imageHint")}
            </span>
          </div>

          <FieldGroup>
            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                control={profileForm.control}
                name="name"
                label={t("myAccount.profile.fullName")}
                placeholder={t("myAccount.profile.fullNamePlaceholder")}
                autoComplete="name"
                required
              />
              <FormInput
                control={profileForm.control}
                name="email"
                type="email"
                label={t("myAccount.profile.email")}
                placeholder={t("myAccount.profile.emailPlaceholder")}
                autoComplete="email"
                required
              />
              <FormInput
                control={profileForm.control}
                name="phone"
                label={t("myAccount.profile.phone")}
                placeholder={t("myAccount.profile.phonePlaceholder")}
                autoComplete="tel"
              />
              <FormInput
                control={profileForm.control}
                name="address"
                label={t("myAccount.profile.address")}
                placeholder={t("myAccount.profile.addressPlaceholder")}
                autoComplete="street-address"
              />
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="mt-6 justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!profileDirty || profileSaving}
            onClick={() => profileForm.reset()}
          >
            {t("button.reset")}
          </Button>
          <Button type="submit" disabled={!profileDirty || profileSaving}>
            {profileSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {t("button.saveChanges")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Profile;
