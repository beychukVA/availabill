import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { Select } from "@/components/common/Select/Select";
import { ISelectItem } from "@/components/common/Select/types/ISelectItem";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useUpdateAddressMutation } from "@/redux/User/Profile/profile-slice";
import { Trans, t } from "@lingui/macro";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import styles from "./AddOrEditAddressModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
  user: ICurrentUser;
  handleServerError: (error: string) => void;
  updateUI: () => void;
}

interface ICountries {
  name: string;
  value: string;
}

const countries: ICountries[] = [
  {
    name: t`Schweiz`,
    value: "Schweiz",
  },
  {
    name: t`Italien`,
    value: "Italien",
  },
  {
    name: t`Frankreich`,
    value: "Frankreich",
  },
  {
    name: t`USA`,
    value: "USA",
  },
];

const addressSchema = z.object({
  country: z.string().min(1, t`Dieses Feld kann nicht leer sein`),
  city: z.string().min(1, t`Dieses Feld kann nicht leer sein`),
  street: z.string().min(1, t`Dieses Feld kann nicht leer sein`),
  zipCode: z.string().min(1, t`Dieses Feld kann nicht leer sein`),
});

export const AddOrEditAddressModal: React.FC<IProps> = ({
  onClose,
  isOpen,
  user,
  handleServerError,
  updateUI,
}) => {
  const [selectKey, setSelectKey] = useState(Math.random());
  const [updateAddress] = useUpdateAddressMutation();
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        country: string;
        city: string;
        street: string;
        zipCode: string;
      },
      string
    >
  >({ _errors: [] });
  const [values, setValues] = useState({
    country: "",
    city: "",
    zipCode: "",
    street: "",
  });
  const enterPressed = useKeyPress(PressedKey.ENTER);

  useEffect(() => {
    setValues({
      ...values,
      country: user?.address?.country || countries[0].value,
      city: user?.address?.city || "",
      zipCode: user?.address?.zipCode || "",
      street: user?.address?.street || "",
    });
    setSelectKey(Math.random());
  }, [user]);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSelect = (item: ISelectItem) => {
    setValues({ ...values, country: item.value as string });
  };

  const handleSupport = () => {};

  const handleClose = () => {
    onClose(false);
  };

  const handleNext = async () => {
    const validationAddress = addressSchema.safeParse({
      country: values.country,
      city: values.city,
      street: values.street,
      zipCode: values.zipCode,
    });
    if (!validationAddress.success) {
      const addressErros = validationAddress.error.format();
      setErrors(addressErros);
    } else {
      setErrors({ _errors: [] });
      await updateAddress({
        userId: user?.id,
        country: values.country,
        city: values.city,
        zipCode: values.zipCode,
        street: values.street,
      })
        .unwrap()
        .then((res) => {
          updateUI();
          onClose(false);
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Ihre Adressdaten konnten nicht gesendet werden. versuchen Sie es nochmal.`
              );
              return;
            case "5":
              handleServerError(t`Serverfehler`);
              return;
            default:
              handleServerError(t`Ein Fehler ist aufgetreten`);
          }
        });
    }
  };

  useEffect(() => {
    if (enterPressed && isOpen) {
      handleNext();
    }
  }, [enterPressed]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Trans>Ändern Sie Ihre Adresse</Trans>
      </div>
      <div className={styles.margin}>
        <div className={styles.description} style={{ marginBottom: 24 }}>
          <Trans>
            Bitte machen Sie Ihre Angaben. Beachten Sie, dass eine
            Adressänderung für Ihre Media Markt CLUB Shopping Card aus
            Sicherheitsgründen getrennt durchgeführt werden muss.
          </Trans>
        </div>
        <div className={styles.description}>
          <Trans>ADRESSE ÄNDERN MediaMarkt CLUB Shopping Card.</Trans>
        </div>
        <div className={styles.inputs}>
          <Input
            mt={48}
            label={t`Strasse und Nr.`}
            type="text"
            placeholder={t`strasse und nr.`}
            textError={errors.street?._errors.join(", ")}
            value={values.street}
            anchor="street"
            onChange={handleChange}
          />
          <div className={styles.inputContainer}>
            <Input
              mt={48}
              label={t`PLZ`}
              type="number"
              placeholder={t`PLZ`}
              textError={errors.zipCode?._errors.join(", ")}
              value={values.zipCode}
              anchor="zipCode"
              onChange={handleChange}
            />
            <Input
              mt={48}
              ml={15}
              label={t`Ort`}
              type="text"
              placeholder={t`Ort`}
              textError={errors.city?._errors.join(", ")}
              value={values.city}
              anchor="city"
              onChange={handleChange}
            />
          </div>
          <span className={styles.label}>
            <Trans>Land</Trans>
          </span>
          <div data-testid="selectCountry" style={{ width: "100%" }}>
            <Select
              key={selectKey}
              className={styles.select}
              handleSelect={handleSelect}
              values={countries}
              selectedValue={values.country}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              marginTop: "3px",
            }}
          >
            <span
              className={styles.support}
              onClick={() => handleSupport()}
            >{t`Anderes Land? Bitte kontaktieren Sie unseren Kundenservice.`}</span>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="white"
          width="fit-content"
          mt={40}
          mr={16}
          onClick={() => handleClose()}
        >
          {t`Abrechen`}
        </Button>
        <Button onClick={() => handleNext()} width="fit-content" mt={40}>
          {t`Speichern`}
        </Button>
      </div>
    </div>
  );
};
