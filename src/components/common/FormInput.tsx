import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "cn";
import { useTranslation } from "react-i18next";

type FormInputProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "url" | "date" | "file";
  inputType?: "text" | "textarea";
  description?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  labelClassName?: string;
  autoComplete?: string;
};

function FormInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  inputType = "text",
  description,
  required = false,
  disabled = false,
  rows = 4,
  className,
  labelClassName,
  autoComplete = "off",
}: FormInputProps<TFieldValues>) {
  const { t } = useTranslation(["common", "validation"]);
  const id = React.useId();
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";
  const isFile = type === "file";
  const isNumber = type === "number";

  return (
    <Controller
      name={name}
      control={control}
      rules={required ? { required: t("validation:required") } : undefined}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid;

        return (
          <Field data-invalid={invalid} className="w-full">
            {label && (
              <FieldLabel htmlFor={id} className={labelClassName}>
                {label}
                {required && <span className="text-red-500">*</span>}
              </FieldLabel>
            )}

            {inputType === "textarea" ? (
              <Textarea
                {...field}
                id={id}
                rows={rows}
                value={field.value ?? ""}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={invalid}
                className={className}
              />
            ) : isPassword ? (
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={id}
                  type={showPassword ? "text" : "password"}
                  value={field.value ?? ""}
                  placeholder={placeholder}
                  disabled={disabled}
                  autoComplete={autoComplete}
                  aria-invalid={invalid}
                  className={className}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={
                      showPassword
                        ? t("common:actions.hidePassword")
                        : t("common:actions.showPassword")
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            ) : isFile ? (
              <Input
                id={id}
                type="file"
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                disabled={disabled}
                aria-invalid={invalid}
                className={className}
                onChange={(e) => field.onChange(e.target.files)}
              />
            ) : (
              <Input
                {...field}
                id={id}
                type={type}
                value={field.value ?? ""}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                aria-invalid={invalid}
                className={cn(className)}
                onChange={(e) => {
                  const val = e.target.value; 
                  field.onChange(
                    isNumber ? (val === "" ? "" : Number(val)) : val,
                  );
                }}
              />
            )}

            {description && <FieldDescription>{description}</FieldDescription>}
            {invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}

export default FormInput;
