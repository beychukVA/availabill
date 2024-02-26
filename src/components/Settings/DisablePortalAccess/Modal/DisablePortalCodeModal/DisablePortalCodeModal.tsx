import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { t, Trans } from "@lingui/macro";
import React, { useState } from "react";
import { z } from "zod";
import styles from "./DisablePortalCodeModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
}

const codeSchema = z
  .string()
  .max(6, t`Maximal zulässige Zeichenanzahl (6)`)
  .regex(/[\dA-Z]{6}/, { message: t`Ungültiger Code` });

export const DisablePortalCodeModal: React.FC<IProps> = ({ onClose }) => {
  const [errors, setErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [values, setValues] = useState({
    code: "",
  });

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleNext = () => {};

  const handleResendCode = () => {};

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        <Trans>Geben Sie den E-Mail Code ein</Trans>
      </span>
      <div className={styles.margin}>
        <p className={styles.description}>
          <Trans>
            Bitte geben Sie den Code ein, den wir Ihnen an «primäre
            E-Mail-Adresse» gesendet haben.
          </Trans>
        </p>
        <Input
          mt={48}
          label={t`Code eingeben`}
          type="code"
          placeholder="-- -- -- --"
          textError={errors._errors.join(", ")}
          value={values.code}
          anchor="code"
          onChange={handleChange}
        />
        <span className={styles.retry}>
          <Trans>
            Keinen Code erhalten? Prüfen Sie zunächst Ihren Spam-Ordner.
          </Trans>
          <br />
          <TransparentButton
            color="secondary"
            mt={4}
            onClick={handleResendCode}
          >
            {t`Code erneut senden`}
          </TransparentButton>
        </span>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="white"
          width="fit-content"
          mt={40}
          mr={16}
          onClick={() => onClose(false)}
        >
          {t`Abrechen`}
        </Button>
        <Button onClick={handleNext} width="fit-content" mt={40}>
          {t`Weiter`}
        </Button>
      </div>
    </div>
  );
};
