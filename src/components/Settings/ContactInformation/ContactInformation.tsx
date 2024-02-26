/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from "react";
import { Trans, t } from "@lingui/macro";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { PencilIcon } from "@/components/Icons/PencilIcon/PencilIcon";
import { format } from "date-fns";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { Button } from "@/components/common/Button/Button";
import { RoundCloseIcon } from "@/components/Icons/RoundCloseIcon/RoundCloseIcon";
import { Alert, Snackbar, useMediaQuery } from "@mui/material";
import { Modal } from "@/components/common/Modal/Modal";
import { ToastError } from "@/components/Toasts/ToastError/ToastError";
import { IGender } from "@/redux/User/Profile/types/IProfile";
import {
  useOneTimePasswordCodeQuery,
  useOneTimePasswordMutation,
} from "@/redux/Auth/auth-slice";
import { useGetAdditionEmailsQuery } from "@/redux/User/Profile/profile-slice";
import { useAppSelector } from "@/redux/store";
import { IProfileTranslations } from "@/utility/types";
import styles from "./ContactInformation.module.scss";
import { EditNameModal } from "./Modal/EditNameModal/EditNameModal";
import { PrimaryEmailLoginModal } from "./Modal/PrimaryEmailModals/PrimaryEmailLoginModal/PrimaryEmailLoginModal";
import { PrimaryEmailCodeModal } from "./Modal/PrimaryEmailModals/PrimaryEmailCodeModal/PrimaryEmailCodeModal";
import { PrimaryPhoneCodeModal } from "./Modal/PrimaryEmailModals/PrimaryPhoneCodeModal/PrimaryPhoneCodeModal";
import { PrimaryResendCodeModal } from "./Modal/PrimaryEmailModals/PrimaryResendCodeModal/PrimaryResendCodeModal";
import { PrimaryEmailSuccessModal } from "./Modal/PrimaryEmailModals/PrimaryEmailSuccessModal/PrimaryEmailSuccessModal";
import { PrimaryEmailConfirmCodeModal } from "./Modal/PrimaryEmailModals/PrimaryEmailConfirmCodeModal/PrimaryEmailConfirmCodeModal";
import { AddOrEditAdditionalEmailModal } from "./Modal/AdditionalEmailModals/AddOrEditAdditionalEmailModal/AddOrEditAdditionalEmailModal";
import { AddEmailConfirmationModal } from "./Modal/AdditionalEmailModals/AddEmailConfirmationModal/AddEmailConfirmationModal";
import { DeleteUnconfirmedEmailConfirmModal } from "./Modal/AdditionalEmailModals/DeleteUnconfirmedEmail/DeleteUnconfirmedEmailConfirmModal";
import { DeleteConfirmedEmailLoginModal } from "./Modal/AdditionalEmailModals/DeleteConfirmedEmail/DeleteConfirmedEmailLoginModal/DeleteConfirmedEmailLoginModal";
import { DeleteConfirmedEmailConfirmModal } from "./Modal/AdditionalEmailModals/DeleteConfirmedEmail/DeleteConfirmedEmailConfirmModal/DeleteConfirmedEmailConfirmModal";
import { DeleteConfirmedEmailCodeModal } from "./Modal/AdditionalEmailModals/DeleteConfirmedEmail/DeleteConfirmedEmailCodeModal/DeleteConfirmedEmailCodeModal";
import { DeleteConfirmedEmailResendCodeModal } from "./Modal/AdditionalEmailModals/DeleteConfirmedEmail/DeleteConfirmedEmailResendCodeModal/DeleteConfirmedEmailResendCodeModal";
import { AddPhoneNumberModal } from "./Modal/PhoneNumberModals/AddPhoneNumberModal/AddPhoneNumberModal";
import { PhoneNumberCodeModal } from "./Modal/PhoneNumberModals/PhoneNumberCodeModal/PhoneNumberCodeModal";
import { AddOrEditAddressModal } from "./Modal/AddressModals/AddOrEditAddressModal";
import { PhoneNumberLoginModal } from "./Modal/PhoneNumberModals/PhoneNumberLoginModal/PhoneNumberLoginModal";
import { PhoneNumberLoginCodeModal } from "./Modal/PhoneNumberModals/PhoneNumberLoginCodeModal/PhoneNumberLoginCodeModal";
import { PhoneNumberResendCodeModal } from "./Modal/PhoneNumberModals/PhoneNumberResendCodeModal/PhoneNumberResendCodeModal";
import { PhoneNumberSuccessModal } from "./Modal/PhoneNumberModals/PhoneNumberSuccessModal/PhoneNumberSuccessModal";
import { NewPhoneNumberCodeModal } from "./Modal/PhoneNumberModals/NewPhoneNumberCodeModal/NewPhoneNumberCodeModal";
import { PhoneNumberConfirmDelete } from "./Modal/PhoneNumberModals/PhoneNumberConfirmDelete/PhoneNumberConfirmDelete";

interface IProps {
  user: ICurrentUser;
  updateUI: () => void;
  forgotPassword: () => void;
}

export interface IUserLogin {
  email: string;
  emailCode: string;
  password: string;
  token: string;
  primaryConfirmationCode: string;
  phoneConfirmationCode: string;
  newPhoneConfirmationCode: string;
  phoneNumber: string;
  stepPhoneNumber: "delete" | "add" | "edit";
}

export interface IAdditionEmail {
  id: number;
  email: string;
  confirmed: boolean;
  user: ICurrentUser;
}

export const ContactInformation: React.FC<IProps> = ({
  user,
  updateUI,
  forgotPassword,
}) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);
  const [oneTimePassword] = useOneTimePasswordMutation();
  const { data: additionalEmails } = useGetAdditionEmailsQuery(
    {
      userId: user?.id,
    },
    { skip: !user?.id }
  );
  const [oneTimeCodeReference, setOneTimeCodeReference] = useState("");
  const [passwordType, setPasswordType] = useState("");

  const { data: tempOneTimePasswordCode, refetch } =
    useOneTimePasswordCodeQuery(
      {
        reference: oneTimeCodeReference,
        passwordType,
      },
      {
        skip: !oneTimeCodeReference,
      }
    );

  const token = useAppSelector((state) => state.user.token);
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [editAddress, setEditAddres] = useState<boolean>(false);
  const matches = useMediaQuery("(min-width:1200px)");
  const [isEditNameModalOpen, setEditNameModalOpen] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState<string>("");
  const [isPrimaryEmailLoginModalOpen, setPrimaryEmailLoginModalOpen] =
    useState(false);
  const [isPrimaryEmailCodeModalOpen, setPrimaryEmailCodeModalOpen] =
    useState(false);
  const [isPrimaryPhoneCodeModalOpen, setPrimaryPhoneCodeModalOpen] =
    useState(false);
  const [isPrimaryResendCodeModalOpen, setPrimaryResendCodeModalOpen] =
    useState(false);
  const [isPrimaryEmailSuccessModalOpen, setPrimaryEmailSuccessModalOpen] =
    useState(false);
  const [
    isAddOrEditAdditionalEmailModalOpen,
    setAddOrEditAdditionalEmailModalOpen,
  ] = useState(false);
  const [
    isPrimaryEmailConfirmCodeModalOpen,
    setPrimaryEmailConfirmCodeModalOpen,
  ] = useState(false);
  const [isAddEmailConfirmationModalOpen, setAddEmailConfirmationModalOpen] =
    useState(false);
  const [
    isDeleteConfirmedEmailLoginModalOpen,
    setDeleteConfirmedEmailLoginModalOpen,
  ] = useState(false);
  const [
    isDeleteConfirmedEmailConfirmModalOpen,
    setDeleteConfirmedEmailConfirmModalOpen,
  ] = useState(false);
  const [
    isDeleteUnconfirmedEmailConfirmModalOpen,
    setDeleteUnconfirmedEmailConfirmModalOpen,
  ] = useState(false);
  const [
    isDeleteConfirmedEmailCodeModalOpen,
    setDeleteConfirmedEmailCodeModalOpen,
  ] = useState(false);
  const [
    isDeleteConfirmedEmailResendCodeModalOpen,
    setDeleteConfirmedEmailResendCodeModalOpen,
  ] = useState(false);
  const [isAddPhoneNumberModalOpen, setAddPhoneNumberModalOpen] =
    useState(false);
  const [isPhoneNumberCodeModalOpen, setPhoneNumberCodeModalOpen] =
    useState(false);
  const [isAddOrEditAddressModalOpen, setAddOrEditAddressModalOpen] =
    useState(false);
  const [isPhoneNumberLoginModalOpen, setPhoneNumberLoginModalOpen] =
    useState(false);
  const [isPhoneNumberLoginCodeModalOpen, setPhoneNumberLoginCodeModalOpen] =
    useState(false);
  const [isPhoneNumberResendCodeModalOpen, setPhoneNumberResendCodeModalOpen] =
    useState(false);
  const [isPhoneNumberSuccessModalOpen, setPhoneNumberSuccessModalOpen] =
    useState(false);
  const [isNewPhoneNumberCodeModalOpen, setNewPhoneNumberCodeModalOpen] =
    useState(false);
  const [isPhoneNumberConfirmDeleteOpen, setPhoneNumberConfirmDeleteOpen] =
    useState(false);
  const [isEditCurrEmail, setEditCurrEmail] = useState(false);
  const [isToastErrorOpen, setToastErrorOpen] = useState(false);
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [values, setValues] = useState<IUserLogin>({
    email: "",
    emailCode: "",
    password: "",
    token: token || "",
    primaryConfirmationCode: "",
    phoneConfirmationCode: "",
    newPhoneConfirmationCode: "",
    phoneNumber: "",
    stepPhoneNumber: "add",
  });
  const [currAdditionEmail, setCurrAdditionEmail] = useState("");

  const handleSetValues = (prop: string, value: string) =>
    setValues({ ...values, [prop]: value });

  useEffect(() => {
    if (serverErrors._errors[0]) {
      setToastErrorOpen(true);
    }
  }, [serverErrors._errors]);

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setServerErrors({ _errors: [] });
    setToastErrorOpen(false);
  };

  const handleServerError = (error: string) => {
    setServerErrors({
      _errors: [error],
    });
  };

  const toggleEditEmail = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails((prev) =>
        prev.filter((prevEmail) => prevEmail !== email)
      );
      return;
    }
    setSelectedEmails((prev) => [...prev, email]);
  };

  const toggleEditPhone = (phone: string) => {
    if (selectedPhones.includes(phone)) {
      setSelectedPhones((prev) =>
        prev.filter((prevPhone) => prevPhone !== phone)
      );
      return;
    }
    setSelectedPhones((prev) => [...prev, phone]);
  };

  const getSalutation = (gender: IGender) =>
    gender === "M" ? t`Herr` : t`Frau`;

  const showCodeModal = () =>
    user?.phoneNumber
      ? setPrimaryPhoneCodeModalOpen(true)
      : setPrimaryEmailCodeModalOpen(true);

  const handleResendEmailCode = async (email: string) => {
    if (email) {
      await oneTimePassword({
        reference: email,
        passwordType: "LINK_KAR_ACCOUNT",
      })
        .unwrap()
        .then((res) => {
          console.log("code sent successfully: ", res);
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Bestätigungscode konnte nicht gesendet werden. Versuchen Sie es nochmal.`
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

  const handleChangeEmail = (email: string) => {
    setCurrAdditionEmail(email);
    setEditCurrEmail(true);
    setAddOrEditAdditionalEmailModalOpen(true);
  };

  const handleRemoveEmail = (email: string, confirmed: boolean) => {
    setDeleteEmail(email);
    if (confirmed) {
      setDeleteConfirmedEmailLoginModalOpen(true);
      return;
    }
    setDeleteUnconfirmedEmailConfirmModalOpen(true);
  };

  const handleAddOrEditAddress = () => {
    setAddOrEditAddressModalOpen(true);
  };

  const makeUserAddress = () =>
    `${user?.address.street}, ${user?.address.zipCode} ${user?.address.city} (${user?.address.country})`;

  const hanldeAddPhoneNumber = () => {
    setValues({ ...values, stepPhoneNumber: "add", phoneNumber: "" });
    setPhoneNumberLoginModalOpen(true);
  };
  const handleDeletePhoneNumber = () => {
    setValues({ ...values, stepPhoneNumber: "delete" });
    setPhoneNumberLoginModalOpen(true);
  };

  const handleEditPhoneNumber = () => {
    setValues({
      ...values,
      stepPhoneNumber: "edit",
      phoneNumber: user.phoneNumber,
    });
    setPhoneNumberLoginModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.fieldContainer}>
        <div data-testid="userName" className={styles.fieldName}>
          {profileTranslations?.name}
        </div>
        <div className={styles.fieldValue}>
          {getSalutation(user?.gender as IGender)} {user?.firstName}{" "}
          {user?.name}
          <div
            data-testid="editNameButton"
            className={styles.edit}
            onClick={() => setEditNameModalOpen(true)}
          >
            <PencilIcon />
          </div>
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldName}>{profileTranslations?.dob}</div>
        <div className={styles.fieldValue}>
          {format(new Date(user?.birthDate || Date.now()), "d.MM.yyyy")}
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldName}>
          {profileTranslations?.primaryEmail}
        </div>
        <div className={styles.vertical}>
          <div className={styles.fieldValue}>{user?.email}</div>
          <div className={styles.fieldDesc}>
            {profileTranslations?.primaryEmailTxt}
          </div>
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div data-testid="email" className={styles.fieldName}>
          {profileTranslations?.secondaryEmails}
        </div>
        <div className={styles.vertical}>
          <div className={styles.emails}>
            {additionalEmails?.content.map(({ id, email, confirmed }) => {
              if (email === user?.email) {
                return null;
              }
              return (
                <div key={`user-email-${email}`}>
                  <div className={styles.fieldValueContainer}>
                    <div className={styles.status}>
                      <div className={styles.fieldValue}>{email}</div>
                      <div className={styles.fieldDesc}>
                        (
                        {confirmed
                          ? profileTranslations?.confirmed
                          : profileTranslations?.notConfirmed}
                        )
                      </div>
                    </div>
                    <div
                      className={styles.edit}
                      onClick={() => toggleEditEmail(email)}
                    >
                      {selectedEmails.includes(email) ? (
                        <RoundCloseIcon color="#222222" />
                      ) : (
                        <PencilIcon />
                      )}
                    </div>
                  </div>
                  <div
                    className={`${styles.emailMenu} ${
                      selectedEmails.includes(email) ? styles.active : ""
                    }`}
                  >
                    {!confirmed && (
                      <Button
                        fontSize={matches ? 12 : 6}
                        onClick={() => handleChangeEmail(email)}
                        variant="white"
                        width="fit-content"
                      >
                        {profileTranslations?.editEmail}
                      </Button>
                    )}
                    <Button
                      fontSize={matches ? 12 : 6}
                      onClick={() => handleRemoveEmail(email, confirmed)}
                      variant="white"
                      width="fit-content"
                    >
                      {profileTranslations?.removeEmail}
                    </Button>
                    {confirmed ? (
                      <Button
                        fontSize={matches ? 12 : 6}
                        onClick={() => {
                          setPrimaryEmail(email);
                          setPrimaryEmailLoginModalOpen(true);
                        }}
                        variant="black"
                        width="fit-content"
                      >
                        {profileTranslations?.setEmailPrimary}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setCurrAdditionEmail(email);
                          setAddEmailConfirmationModalOpen(true);
                        }}
                        fontSize={matches ? 12 : 6}
                        variant="black"
                        width="fit-content"
                      >
                        {profileTranslations?.confirmEmailAddress}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div data-testid="addNewEmailButton">
            <TransparentButton
              mt={16}
              color="secondary"
              onClick={() => {
                setCurrAdditionEmail("");
                setAddOrEditAdditionalEmailModalOpen(true);
              }}
            >
              {profileTranslations?.newEmailAdd}
            </TransparentButton>
          </div>
        </div>
      </div>
      {user?.phoneNumber ? (
        <div className={styles.phones}>
          <div>
            <div
              className={styles.fieldContainer}
              style={{
                marginBottom: selectedPhones.includes(user?.phoneNumber)
                  ? "8px"
                  : "24px",
              }}
            >
              <div data-testid="phone" className={styles.fieldName}>
                {profileTranslations?.mobileNumber}
              </div>
              <div className={styles.fieldValue}>
                {user?.phoneNumber.slice(0, 6)}&nbsp;.....
                <div
                  data-testid="menuPhoneButton"
                  className={styles.edit}
                  onClick={() => toggleEditPhone(user?.phoneNumber)}
                >
                  {selectedPhones.includes(user?.phoneNumber) ? (
                    <RoundCloseIcon color="#222222" />
                  ) : (
                    <PencilIcon />
                  )}
                </div>
              </div>
            </div>
            <div
              className={`${styles.phoneMenu} ${
                selectedPhones.includes(user?.phoneNumber) ? styles.active : ""
              }`}
            >
              <Button
                fontSize={matches ? 12 : 6}
                onClick={() => handleDeletePhoneNumber()}
                variant="white"
                width="fit-content"
              >{t`Entfernen`}</Button>
              <div data-testid="editPhoneButton">
                <Button
                  fontSize={matches ? 12 : 6}
                  onClick={() => handleEditPhoneNumber()}
                  variant="black"
                  width="fit-content"
                >{t`Bearbeiten`}</Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.fieldContainer}>
          <div data-testid="phone" className={styles.fieldName}>
            {profileTranslations?.mobileNumber}
          </div>
          <div data-testid="addNewPhoneButton">
            <TransparentButton
              mt={5}
              color="secondary"
              onClick={() => hanldeAddPhoneNumber()}
            >
              {profileTranslations?.newMobileAdd}
            </TransparentButton>
          </div>
        </div>
      )}
      {/* <div className={styles.address}>
        <div
          className={styles.fieldContainer}
          style={{
            marginBottom: editAddress ? "8px" : "24px",
          }}
        >
          <div data-testid="address" className={styles.fieldName}>
            <Trans>Adresse</Trans>
          </div>
          <div className={styles.fieldValue}>
            <>{user?.address && makeUserAddress()}</>
            {user?.address ? (
              <div
                data-testid="menuAddressButton"
                className={styles.edit}
                onClick={() => setEditAddres(!editAddress)}
              >
                {editAddress ? (
                  <RoundCloseIcon color="#222222" />
                ) : (
                  <PencilIcon />
                )}
              </div>
            ) : (
              <div data-testid="addAddressButton">
                <TransparentButton
                  mt={5}
                  color="secondary"
                  onClick={() => handleAddOrEditAddress()}
                >{t`+ Neue Adresse hinzufügen`}</TransparentButton>
              </div>
            )}
          </div>
        </div>
        {user?.address && (
          <div
            className={`${styles.addressMenu} ${
              editAddress ? styles.active : ""
            }`}
          >
            <div data-testid="editAddressButton">
              <Button
                fontSize={matches ? 12 : 6}
                onClick={() => handleAddOrEditAddress()}
                variant="black"
                width="fit-content"
              >{t`Bearbeiten`}</Button>
            </div>
          </div>
        )}
      </div> */}
      <Modal isModalOpen={isEditNameModalOpen} onClose={setEditNameModalOpen}>
        <EditNameModal
          isOpen={isEditNameModalOpen}
          updateUI={updateUI}
          user={user}
          onClose={setEditNameModalOpen}
          handleServerError={handleServerError}
        />
      </Modal>
      <Modal
        isModalOpen={isPrimaryEmailLoginModalOpen}
        onClose={setPrimaryEmailLoginModalOpen}
      >
        <PrimaryEmailLoginModal
          isOpen={isPrimaryEmailLoginModalOpen}
          values={values}
          setValues={handleSetValues}
          updateUI={updateUI}
          user={user}
          onClose={setPrimaryEmailLoginModalOpen}
          handleServerError={handleServerError}
          showCodeModal={showCodeModal}
          forgotPassword={forgotPassword}
        />
      </Modal>
      <Modal
        isModalOpen={isPrimaryEmailCodeModalOpen}
        onClose={setPrimaryEmailCodeModalOpen}
      >
        {isPrimaryEmailCodeModalOpen && (
          <PrimaryEmailCodeModal
            isOpen={isPrimaryEmailCodeModalOpen}
            primaryEmail={primaryEmail}
            values={values}
            setValues={handleSetValues}
            updateUI={updateUI}
            user={user}
            onClose={setPrimaryEmailCodeModalOpen}
            handleServerError={handleServerError}
            openResendCodeSucces={setPrimaryResendCodeModalOpen}
            showSuccessModal={setPrimaryEmailSuccessModalOpen}
            showConfirmCodeModal={setPrimaryEmailConfirmCodeModalOpen}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
          />
        )}
      </Modal>
      <Modal
        isModalOpen={isPrimaryPhoneCodeModalOpen}
        onClose={setPrimaryPhoneCodeModalOpen}
      >
        <PrimaryPhoneCodeModal
          isOpen={isPrimaryPhoneCodeModalOpen}
          primaryEmail={primaryEmail}
          values={values}
          setValues={handleSetValues}
          updateUI={updateUI}
          user={user}
          onClose={setPrimaryPhoneCodeModalOpen}
          handleServerError={handleServerError}
          openResendCodeSucces={setPrimaryResendCodeModalOpen}
          showSuccessModal={setPrimaryEmailSuccessModalOpen}
          showConfirmCodeModal={setPrimaryEmailConfirmCodeModalOpen}
        />
      </Modal>
      <Modal
        isModalOpen={isPrimaryEmailConfirmCodeModalOpen}
        onClose={setPrimaryEmailConfirmCodeModalOpen}
      >
        {isPrimaryEmailConfirmCodeModalOpen && (
          <PrimaryEmailConfirmCodeModal
            isOpen={isPrimaryEmailConfirmCodeModalOpen}
            primaryEmail={primaryEmail}
            values={values}
            setValues={handleSetValues}
            updateUI={updateUI}
            user={user}
            onClose={setPrimaryEmailConfirmCodeModalOpen}
            handleServerError={handleServerError}
            openResendCodeSucces={setPrimaryResendCodeModalOpen}
            showSuccessModal={setPrimaryEmailSuccessModalOpen}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
          />
        )}
      </Modal>
      <Modal
        isModalOpen={isPrimaryResendCodeModalOpen}
        onClose={setPrimaryResendCodeModalOpen}
      >
        <PrimaryResendCodeModal
          onClose={setPrimaryResendCodeModalOpen}
          openCodeModal={showCodeModal}
        />
      </Modal>
      <Modal
        isModalOpen={isPrimaryEmailSuccessModalOpen}
        onClose={setPrimaryEmailSuccessModalOpen}
      >
        <PrimaryEmailSuccessModal onClose={setPrimaryEmailSuccessModalOpen} />
      </Modal>
      <Modal
        isModalOpen={isAddOrEditAdditionalEmailModalOpen}
        onClose={setAddOrEditAdditionalEmailModalOpen}
      >
        <AddOrEditAdditionalEmailModal
          translations={profileTranslations}
          isOpen={isAddOrEditAdditionalEmailModalOpen}
          onClose={setAddOrEditAdditionalEmailModalOpen}
          handleServerError={handleServerError}
          showAddEmailConfirmation={setAddEmailConfirmationModalOpen}
          setCurrAdditionEmail={setCurrAdditionEmail}
          currAdditionEmail={currAdditionEmail}
          updateUI={updateUI}
          additionalsEmails={additionalEmails?.content}
          isEditCurrEmail={isEditCurrEmail}
          setEditCurrEmail={setEditCurrEmail}
          user={user}
        />
      </Modal>
      <Modal
        isModalOpen={isAddEmailConfirmationModalOpen}
        onClose={setAddEmailConfirmationModalOpen}
      >
        {isAddEmailConfirmationModalOpen && (
          <AddEmailConfirmationModal
            onClose={setAddEmailConfirmationModalOpen}
            handleServerError={handleServerError}
            showEditEmailModal={setAddOrEditAdditionalEmailModalOpen}
            setCurrAdditionEmail={setCurrAdditionEmail}
            updateUI={updateUI}
            currAdditionEmail={currAdditionEmail}
            isEditCurrEmail={isEditCurrEmail}
            setEditCurrEmail={setEditCurrEmail}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
          />
        )}
      </Modal>
      <Modal
        isModalOpen={isDeleteUnconfirmedEmailConfirmModalOpen}
        onClose={setDeleteUnconfirmedEmailConfirmModalOpen}
      >
        <DeleteUnconfirmedEmailConfirmModal
          onClose={setDeleteUnconfirmedEmailConfirmModalOpen}
          deleteEmail={deleteEmail}
          setDeleteEmail={setDeleteEmail}
          handleServerError={handleServerError}
          user={user}
        />
      </Modal>
      <Modal
        isModalOpen={isDeleteConfirmedEmailLoginModalOpen}
        onClose={setDeleteConfirmedEmailLoginModalOpen}
      >
        <DeleteConfirmedEmailLoginModal
          deleteEmail={deleteEmail}
          isOpen={isDeleteConfirmedEmailLoginModalOpen}
          onClose={setDeleteConfirmedEmailLoginModalOpen}
          showCodeModal={setDeleteConfirmedEmailCodeModalOpen}
          handleServerError={handleServerError}
          setValues={handleSetValues}
          values={values}
          forgotPassword={forgotPassword}
          user={user}
        />
      </Modal>
      <Modal
        isModalOpen={isDeleteConfirmedEmailCodeModalOpen}
        onClose={setDeleteConfirmedEmailCodeModalOpen}
      >
        {isDeleteConfirmedEmailCodeModalOpen && (
          <DeleteConfirmedEmailCodeModal
            isOpen={isDeleteConfirmedEmailCodeModalOpen}
            onClose={setDeleteConfirmedEmailCodeModalOpen}
            handleServerError={handleServerError}
            setValues={handleSetValues}
            values={values}
            openResendCodeSucces={setDeleteConfirmedEmailResendCodeModalOpen}
            showConfirmDeleteModal={setDeleteConfirmedEmailConfirmModalOpen}
            user={user}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
          />
        )}
      </Modal>
      <Modal
        isModalOpen={isDeleteConfirmedEmailResendCodeModalOpen}
        onClose={setDeleteConfirmedEmailResendCodeModalOpen}
      >
        <DeleteConfirmedEmailResendCodeModal
          onClose={setDeleteConfirmedEmailResendCodeModalOpen}
          openCodeModal={setDeleteConfirmedEmailCodeModalOpen}
        />
      </Modal>
      <Modal
        isModalOpen={isDeleteConfirmedEmailConfirmModalOpen}
        onClose={setDeleteConfirmedEmailConfirmModalOpen}
      >
        {isDeleteConfirmedEmailConfirmModalOpen && (
          <DeleteConfirmedEmailConfirmModal
            onClose={setDeleteConfirmedEmailConfirmModalOpen}
            deleteEmail={deleteEmail}
            handleServerError={handleServerError}
            setDeleteEmail={setDeleteEmail}
            user={user}
            values={values}
          />
        )}
      </Modal>
      <Modal
        isModalOpen={isPhoneNumberLoginModalOpen}
        onClose={setPhoneNumberLoginModalOpen}
      >
        <PhoneNumberLoginModal
          translations={profileTranslations}
          isOpen={isPhoneNumberLoginModalOpen}
          onClose={setPhoneNumberLoginModalOpen}
          handleServerError={handleServerError}
          setValues={handleSetValues}
          values={values}
          showCodeModal={setPhoneNumberLoginCodeModalOpen}
          user={user}
          forgotPassword={forgotPassword}
        />
      </Modal>
      <Modal
        isModalOpen={isPhoneNumberLoginCodeModalOpen}
        onClose={setPhoneNumberLoginCodeModalOpen}
      >
        {isPhoneNumberLoginCodeModalOpen && (
          <PhoneNumberLoginCodeModal
            onClose={setPhoneNumberLoginCodeModalOpen}
            handleServerError={handleServerError}
            setValues={handleSetValues}
            values={values}
            openResendCodeSucces={setPhoneNumberResendCodeModalOpen}
            showAddPhoneNumberModal={setAddPhoneNumberModalOpen}
            showDeletePhoneNumberModal={setPhoneNumberConfirmDeleteOpen}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
          />
        )}
      </Modal>
      <Modal
        isModalOpen={isPhoneNumberConfirmDeleteOpen}
        onClose={setPhoneNumberConfirmDeleteOpen}
      >
        <PhoneNumberConfirmDelete
          onClose={setPhoneNumberConfirmDeleteOpen}
          handleServerError={handleServerError}
          updateUI={updateUI}
          user={user}
          values={values}
        />
      </Modal>
      <Modal
        isModalOpen={isPhoneNumberResendCodeModalOpen}
        onClose={setPhoneNumberResendCodeModalOpen}
      >
        <PhoneNumberResendCodeModal
          onClose={setPhoneNumberResendCodeModalOpen}
          openCodeModal={setPhoneNumberLoginCodeModalOpen}
        />
      </Modal>
      <Modal
        isModalOpen={isAddPhoneNumberModalOpen}
        onClose={setAddPhoneNumberModalOpen}
      >
        <AddPhoneNumberModal
          isOpen={isAddPhoneNumberModalOpen}
          onClose={setAddPhoneNumberModalOpen}
          handleServerError={handleServerError}
          user={user}
          showPhoneNumberCodeModal={setPhoneNumberCodeModalOpen}
          setValues={handleSetValues}
          values={values}
        />
      </Modal>
      <Modal
        isModalOpen={isPhoneNumberCodeModalOpen}
        onClose={setPhoneNumberCodeModalOpen}
      >
        {isPhoneNumberCodeModalOpen && (
          <PhoneNumberCodeModal
            onClose={setPhoneNumberCodeModalOpen}
            handleServerError={handleServerError}
            user={user}
            // openResendCodeSucces={setPrimaryResendCodeModalOpen}
            setValues={handleSetValues}
            values={values}
            updateUI={updateUI}
            showNewPhoneCodeModal={setNewPhoneNumberCodeModalOpen}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
          />
        )}
      </Modal>
      <Modal
        isModalOpen={isNewPhoneNumberCodeModalOpen}
        onClose={setNewPhoneNumberCodeModalOpen}
      >
        {isNewPhoneNumberCodeModalOpen && (
          <NewPhoneNumberCodeModal
            onClose={setNewPhoneNumberCodeModalOpen}
            handleServerError={handleServerError}
            user={user}
            openResendCodeSucces={setPrimaryResendCodeModalOpen}
            setValues={handleSetValues}
            values={values}
            updateUI={updateUI}
            showSuccessModal={setPhoneNumberSuccessModalOpen}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
            setPasswordType={setPasswordType}
          />
        )}
      </Modal>
      <Modal
        isModalOpen={isPhoneNumberSuccessModalOpen}
        onClose={setPhoneNumberSuccessModalOpen}
      >
        <PhoneNumberSuccessModal onClose={setPhoneNumberSuccessModalOpen} />
      </Modal>
      <Modal
        isModalOpen={isAddOrEditAddressModalOpen}
        onClose={setAddOrEditAddressModalOpen}
      >
        <AddOrEditAddressModal
          isOpen={isAddOrEditAddressModalOpen}
          onClose={setAddOrEditAddressModalOpen}
          user={user}
          handleServerError={handleServerError}
          updateUI={updateUI}
        />
      </Modal>
      <ToastError
        message={serverErrors._errors.join(", ")}
        duration={6000}
        open={isToastErrorOpen}
        handleClose={handleCloseToast}
      />
      {tempOneTimePasswordCode?.code && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Your code is: {tempOneTimePasswordCode?.code}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};
