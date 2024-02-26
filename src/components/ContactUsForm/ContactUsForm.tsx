import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import { useAppSelector } from "@/redux/store";
import { IContactUsTranslations } from "@/utility/types";
import { t } from "@lingui/macro";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../common/Button/Button";
import { Input } from "../common/Input/Input";
import { TextArea } from "../common/TextArea/TextArea";
import { Error } from "../Error/Error";
import { FlagIcon } from "../Icons/FlagIcon/FlagIcon";
import styles from "./ContactUsForm.module.scss";

interface IProps {
  contactUsTranslations: IContactUsTranslations;
}

const contactUsFormSchema = z.object({
  firstName: z
    .string()
    .min(1, t`Bitte geben Sie mindestens ein Zeichen ein (1)`),
  lastName: z
    .string()
    .min(1, t`Bitte geben Sie mindestens ein Zeichen ein (1)`),
  email: z.string().email(t`E-Mail ist nicht korrekt`),
  mobile: z
    .string()
    .min(10, { message: t`Telefonnummer ist nicht korrekt` })
    .max(10, { message: t`Telefonnummer ist nicht korrekt` }),
  text: z.string().min(1, t`Dieses Feld kann nicht leer sein`),
});

export const ContactUsForm: React.FC<IProps> = ({ contactUsTranslations }) => {
  const token = useAppSelector((state) => state.user.token);
  const { data: user } = useGetCurrentUserQuery(token);

  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        firstName: string;
        lastName: string;
        email: string;
        mobile: string;
        text: string;
      },
      string
    >
  >({ _errors: [] });
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [values, setValues] = useState({
    firstName: user?.name || "",
    lastName: user?.firstName || "",
    email: user?.email || "",
    mobile: user?.phoneNumber || "",
    text: "",
  });

  const handleChange =
    (prop: string) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async () => {
    const validationContactUsFormSchema = contactUsFormSchema.safeParse({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      text: values.text,
    });
    if (!validationContactUsFormSchema.success) {
      const loginFormErros = validationContactUsFormSchema.error.format();
      setErrors(loginFormErros);
    } else {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      // TODO: send request
    }
  };

  return (
    <div className={styles.container}>
      {serverErrors._errors[0] && (
        <Error>{serverErrors._errors.join(", ")}</Error>
      )}
      <div className={styles.row}>
        <Input
          label={contactUsTranslations?.formName}
          type="text"
          placeholder={contactUsTranslations?.formName}
          textError={errors.lastName?._errors.join(", ")}
          value={values.lastName}
          anchor="lastName"
          onChange={handleChange}
        />
        <Input
          ml={16}
          label={contactUsTranslations?.formSurname}
          type="text"
          placeholder={contactUsTranslations?.formSurname}
          textError={errors.firstName?._errors.join(", ")}
          value={values.firstName}
          anchor="firstName"
          onChange={handleChange}
        />
      </div>
      <div className={styles.row}>
        <Input
          mt={35}
          label={contactUsTranslations?.formEmail}
          type="email"
          placeholder={contactUsTranslations?.formEmail}
          textError={errors.email?._errors.join(", ")}
          value={values.email}
          anchor="email"
          onChange={handleChange}
        />
        <Input
          ml={16}
          mt={35}
          icon={<FlagIcon />}
          label={contactUsTranslations?.formPhone}
          type="tel"
          placeholder="--- --- -- --"
          textError={errors.mobile?._errors.join(", ")}
          value={values.mobile}
          anchor="mobile"
          onChange={handleChange}
        />
      </div>
      <TextArea
        mt={35}
        label={contactUsTranslations?.formCommunication}
        placeholder=""
        textError={errors.text?._errors.join(", ")}
        value={values.text}
        anchor="text"
        onChange={handleChange}
      />
      <div className={styles.buttons}>
        <Button
          width="fit-content"
          mt={40}
          pr={20}
          pl={20}
          onClick={handleSubmit}
        >
          {contactUsTranslations?.formSubmitButton}
        </Button>
      </div>
    </div>
  );
};
