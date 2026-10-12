import { useRef, type ChangeEvent } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera, Trash2 } from "lucide-react";

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormInput from "@/components/common/FormInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const businessProfileSchema = z.object({
  logoUrl: z.string().optional(),
  businessName: z.string().min(1, "Business name is required"),
  businessPhone: z.string().min(1, "Business contact number is required"),
  businessEmail: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  businessCategory: z.string().min(1, "Business category is required"),
  businessType: z.string().min(1, "Business type is required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  registrationNumber: z.string().optional(),
  bankAccount: z.string().optional(),
});

type BusinessProfileValues = z.infer<typeof businessProfileSchema>;

const CATEGORY_OPTIONS = [
  "Information Technology",
  "Retail & E-commerce",
  "Healthcare & Pharmaceuticals",
  "Finance & Banking",
  "Hospitality & Tourism",
  "Construction & Real Estate",
  "Education",
  "Agriculture & Farming",
] as const;

const BUSINESS_TYPE_OPTIONS = [
  "Retailer",
  "Wholesaler",
  "Distributor",
  "Manufacturer",
  "Service",
] as const;

const BusinessInfoForm = () => {
  const { t } = useTranslation("settings");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BusinessProfileValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      logoUrl: "",
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      businessCategory: "Information Technology",
      businessType: "Wholesaler",
      province: "",
      district: "",
      municipality: "",
      streetAddress: "",
      registrationNumber: "",
      bankAccount: "",
    },
  });

  const logoUrl = form.watch("logoUrl");
  const businessName = form.watch("businessName");

  const getInitials = (name: string) => {
    if (!name) return "BP";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      form.setValue("logoUrl", previewUrl, { shouldDirty: true });
    }
  };

  const handleRemoveLogo = () => {
    form.setValue("logoUrl", "", { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSave = async (values: BusinessProfileValues) => {
    console.log("Saving business profile:", values);
    form.reset(values);
  };

  const { isDirty, isSubmitting } = form.formState;

  return (
    <Card>
      <form onSubmit={form.handleSubmit(onSave)} noValidate>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-base font-semibold border-b pb-2">
              {t("businessProfile.sections.basicInfo")}
            </h3>

            <div className="flex flex-col items-center sm:items-start gap-3 pb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
                id="logo-upload"
              />

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative rounded-full ring-offset-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={t("businessProfile.fields.uploadLogo")}
                >
                  <Avatar className="h-24 w-24 border cursor-pointer">
                    <AvatarImage src={logoUrl} alt={businessName} />
                    <AvatarFallback className="text-xl font-semibold bg-muted">
                      {getInitials(businessName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-6 w-6" />
                    <span className="text-[10px] font-medium mt-0.5">
                      {t("businessProfile.fields.upload")}
                    </span>
                  </div>
                </button>

                {logoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleRemoveLogo}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("businessProfile.fields.remove")}
                  </Button>
                )}
              </div>

              <span className="text-xs text-muted-foreground">
                {t("businessProfile.fields.imageHint")}
              </span>
            </div>

            <FieldGroup>
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  control={form.control}
                  name="businessName"
                  label={t("businessProfile.fields.businessName")}
                  placeholder={t(
                    "businessProfile.fields.businessNamePlaceholder",
                  )}
                  required
                />

                <FormInput
                  control={form.control}
                  name="businessPhone"
                  label={t("businessProfile.fields.businessPhone")}
                  placeholder={t(
                    "businessProfile.fields.businessPhonePlaceholder",
                  )}
                  autoComplete="tel"
                  required
                />

                <FormInput
                  control={form.control}
                  name="businessEmail"
                  label={t("businessProfile.fields.businessEmail")}
                  type="email"
                  placeholder={t(
                    "businessProfile.fields.businessEmailPlaceholder",
                  )}
                  autoComplete="email"
                  required
                />

                <Controller
                  control={form.control}
                  name="businessCategory"
                  render={({ field, fieldState }) => (
                    <Field invalid={Boolean(fieldState.error)}>
                      <FieldLabel required>
                        {t("businessProfile.fields.businessCategory")}
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "businessProfile.fields.selectCategory",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="businessType"
                  render={({ field, fieldState }) => (
                    <Field invalid={Boolean(fieldState.error)}>
                      <FieldLabel required>
                        {t("businessProfile.fields.businessType")}
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("businessProfile.fields.selectType")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_TYPE_OPTIONS.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormInput
                  control={form.control}
                  name="registrationNumber"
                  label={t("businessProfile.fields.registrationNumber")}
                  placeholder={t(
                    "businessProfile.fields.registrationNumberPlaceholder",
                  )}
                />
              </div>
            </FieldGroup>
          </div>

          <div className="space-y-6">
            <h3 className="text-base font-semibold border-b pb-2">
              {t("businessProfile.sections.addressInfo")}
            </h3>
            <FieldGroup>
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  control={form.control}
                  name="province"
                  label={t("businessProfile.fields.province")}
                  placeholder={t("businessProfile.fields.selectProvince")}
                  required
                />
                <FormInput
                  control={form.control}
                  name="district"
                  label={t("businessProfile.fields.district")}
                  placeholder={t("businessProfile.fields.selectDistrict")}
                  required
                />
                <FormInput
                  control={form.control}
                  name="municipality"
                  label={t("businessProfile.fields.municipality")}
                  placeholder={t("businessProfile.fields.selectMunicipality")}
                  required
                />
                <FormInput
                  control={form.control}
                  name="streetAddress"
                  label={t("businessProfile.fields.streetAddress")}
                  placeholder={t(
                    "businessProfile.fields.streetAddressPlaceholder",
                  )}
                  required
                />
              </div>
            </FieldGroup>
          </div>

          <div className="space-y-6">
            <h3 className="text-base font-semibold border-b pb-2">
              {t("businessProfile.sections.financialInfo")}
            </h3>
            <FieldGroup>
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  control={form.control}
                  name="bankAccount"
                  label={t("businessProfile.fields.bankAccount")}
                  placeholder={t(
                    "businessProfile.fields.bankAccountPlaceholder",
                  )}
                />
              </div>
            </FieldGroup>
          </div>
        </CardContent>

        <CardFooter className="mt-6 justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || isSubmitting}
            onClick={() => form.reset()}
          >
            {t("button.reset")}
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {t("button.saveChanges")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BusinessInfoForm;
