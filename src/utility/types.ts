export type IPaginatedResponse = {
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  pageable: unknown;
  sort: unknown;
};

export interface IOnboardingTranslations {
  greeting: string;
  registerCTA: string;
  loginCTA: string;
  onboardingSubTxt_1: string;
  onboardingSubTxt_2: string;
  heading_1: string;
  subheading_1: string;
  registerNowTxt: string;
  withMyAvailabill: string;
  registerYourself: string;
  alreadyHaveAccountTxt: string;
  forgotPasswordTxt: string;
  newPasswordCTA: string;
  confirmAndContinueBtn: string;
  emailLabelLogin: string;
  emailLoginRegister: string;
  passLabelLogin: string;
  registerNowCTA: string;
  impressum: string;
  datenshutz: string;
  newHere: string;
  registerCTATxt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  haveQuestion: string;
  copyRight: string;
  enterYourConfirmationCode: string;
  confirmationCodeAtEmail_1: string;
  confirmationCodeAtEmail_2: string;
  confirmationCodeLabel: string;
  resendCodeCTA: string;
  sendCTA: string;
  didNotReceiveEmailQuestion: string;
  confirmMobileNumberTxt: string;
  changeMobileNumberCTA: string;
  didntGetSmsTxt: string;
  letTheText: string;
  resendCodeTxt: string;
  sendTxt: string;
  alreadyHaveCodeTxt: string;
  addAnEmailTxt: string;
  addAnEmailDesc: string;
  weHaveGivenYouConfirmationCode_1: string;
  weHaveGivenYouConfirmationCode_2: string;
  confirmYourEmail: string;
  addPhoneTitle: string;
  addPhoneDescription: string;
  addPhoneLabel: string;
  doNotHaveMobileNumberBtn: string;
  passwordInfo: string;
  userInfoTitle: string;
  man: string;
  woman: string;
  nameLabel: string;
  namePlaceholder: string;
  surnameLabel: string;
  surnamePlaceholder: string;
  birthdayLabel: string;
  backBtn: string;
  conclusionBtn: string;
  forgotPasswordFormTitle: string;
  enterConfirmationCodeLabel: string;
  enterNewPasswordLabel: string;
  enterNewPasswordPlaceholder: string;
  newPasswordBtnCancel: string;
  newPasswordBtnSend: string;
}

export interface IDashboardTranslations {
  mainHeading: string;
  yourBills: string;
  transOpen: string;
  transOverdue: string;
  lastPurchase: string;
  purchaseFrom: string;
  amount: string;
  yourCardsAccounts: string;
  noCardData: string;
  expenditure: string;
  accessible: string;
  moreCardsAndAccounts: string;
  availableSoon: string;
  yourSettings: string;
  emailAddressesAvailabill: string;
  yourDealers: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  lastTransactionAt: string;
  addEmailAddress: string;
  noOverdueTxt_1: string;
  noOverdueTxt_2: string;
}

export interface IBillsTranslations {
  yourBills: string;
  addEmailAddress: string;
  addCard: string;
  interestStatements: string;
  cantFindAllInvoices: string;
  perhapsMultiEmails: string;
  addEmailAddresses: string;
  mediaMarktMonthlyStats: string;
  registerMediaMarktCard_1: string;
  registerMediaMarktCard_2: string;
  interestStatementsInfo: string;
  specificInvoice: string;
  date: string;
  amount: string;
  invoiceStatus: string;
  dealer: string;
  selectRange: string;
  clearFilter: string;
  dueOn: string;
  invoiceCopy: string;
  showMore: string;
  showAll: string;
  downloadSection: string;
  showPaymentInfo: string;
  extendPaymentPeriod: string;
  objectToInvoice: string;
  requestACallback: string;
  enterPhoneNumber: string;
  payBillLater: string;
  extendPaymentPeriodExplanation: string;
  paymentPeriodExtendOnlyOnce: string;
  extendPaymentPeriodModalButton: string;
  youHaveExtendedPaymentPeriod: string;
  newDueDateExplanation: string;
  closeTxt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  paymentPeriodExtendedFifteenDays: string;
  inTotal: string;
  orderedItems: string;
  purchaseFrom: string;
  email: string;
  authorizationNumber: string;
  cancel: string;
  send: string;
  callbackSuccessfullyReq: string;
  weWillGetBackToYou: string;
  requestCallBackModalPhonePlaceholder: string;
  filterByAccountStatus: { name: string; value: string }[];
}

export interface ICardAccountTranslations {
  cardsAndAccounts: string;
  registerYourCard: string;
  weHaveSentYouRegisterCode: string;
  registerCodeLabel: string;
  cardNumberLabel: string;
  didNotReceiveRegCode: string;
  joinNow: string;
  notMediaMarktCardHolder: string;
  applyMediaMarktCard: string;
  principalCardHoldersNote: string;
  applyForRegCode: string;
  enterDobCardNumber: string;
  send: string;
  close: string;
  dob: string;
  regCodeApplied: string;
  receiveCodeInfoTxt: string;
  digitalServices: string;
  securelyManageMediaMarkt: string;
  manageInvoice: string;
  viewTransactions: string;
  manageAccountLimits: string;
  orderReplacementCard: string;
  changeAddress: string;
  blockCardOnline: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  moreCardsAvailableSoon: string;
}

export interface IProfileTranslations {
  emailAddrYourProfile: string;
  mister: string;
  contactDetails: string;
  language: string;
  changePassword: string;
  twoFA: string;
  notifications: string;
  disablePortalAccess: string;
  name: string;
  dob: string;
  primaryEmail: string;
  primaryEmailTxt: string;
  removeEmail: string;
  setEmailPrimary: string;
  wantToRemoveEmailTxt: string;
  enterCredentialsToRemoveEmail: string;
  loginLabel: string;
  passwordLabel: string;
  forgotPassowrd: string;
  further: string;
  confirmYourEmail: string;
  pleaseEnterCodeEmail: string;
  enterCodeLabel: string;
  didNotReceiveCode: string;
  sendTheCodeAgain: string;
  cancelButton: string;
  confirmButton: string;
  areYouSureRemoveEmail: string;
  confirmEmailRemove: string;
  weWillSendCode: string;
  congratulations: string;
  emailSetToPrimary: string;
  closeButton: string;
  secondaryEmails: string;
  confirmed: string;
  mobileNumber: string;
  newEmailAdd: string;
  newMobileAdd: string;
  editLanguage: string;
  saveTxt: string;
  createNewPass: string;
  whatMakesPassSecure: string;
  oldPassLabel: string;
  newPassLabel: string;
  confirmNewPassLabel: string;
  forgotReqPass: string;
  savePass: string;
  twoFactorAuth: string;
  yourPortalAccessTxt: string;
  twoFAtxt_1: string;
  twoFAtxt_2: string;
  twoFAtxt_3: string;
  twoFAtxt_4: string;
  receivedRegardlessTxt: string;
  importantAdminEmails: string;
  newsletter: string;
  email: string;
  sms: string;
  newsletterTxt: string;
  depositInfo: string;
  depositInfoTxt: string;
  deactivatePortal: string;
  deactivatePortalExplained: string;
  deactivatePortalTxt: string;
  deactivatePortalBtn: string;
  confirmDeactivation: string;
  confirmDeactivationTxt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  notConfirmed: string;
  confirmEmailAddress: string;
  editEmail: string;
  enterPassword: string;
  checkYourSpam: string;
  setAsPrimaryPhoneNumberTitle: string;
  deleteYourMobilePhoneNumberTitle: string;
  enterYourEmailAddressTitle: string;
  passwordInfoTitle: string;
  passwordInfoDescription: string;
  deletePhoneNumberLoginModalSubtitle_1: string;
  deletePhoneNumberLoginModalSubtitle_2: string;
  addPhoneNumberLoginModalSubtitle: string;
  phoneNumberLoginModalFieldLoginLabel: string;
  phoneNumberLoginModalFieldLoginPlaceholder: string;
  phoneNumberLoginModalFieldPasswordLabel: string;
  phoneNumberLoginModalFieldPasswordPlaceholder: string;
  phoneNumberLoginModalDescription: string;
  phoneNumberLoginModalBtnForgotPassword: string;
  phoneNumberLoginModalBtnNext: string;
  additionalEmailModalFieldEmailLabel: string;
  additionalEmailModalFieldEmailPlaceholder: string;
  additionalEmailModalFieldRepeatEmailLabel: string;
  additionalEmailModalFieldRepeatEmailPlaceholder: string;
  additionalEmailModalBtnCancell: string;
  additionalEmailModalBtnNext: string;
  primaryEmailLoginSubtitle1: string;
  primaryEmailLoginSubtitle2: string;
  confirmYourEmailSubtitle1: string;
  confirmYourEmailSubtitle2: string;
  confirmYourEmailChangeBtn: string;
  confirmYourEmailDesc1: string;
  confirmYourEmailDesc2: string;
  confirmYourEmailResendBtn: string;
  confirmYourEmailCloseBtn: string;
  phoneModalConfirmEmail: string;
  phoneModalConfirmNumber: string;
}

export interface ISidebarTranslations {
  yourBills: string;
  yourAvailabill: string;
  cardsAndAccounts: string;
  yourSettings: string;
  notifications: string;
  customerService: string;
}

export interface IImprintTranslations {
  heading: string;
  firstSection: string;
  secondSection: string;
  thirdSection: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface IInboxTranslations {
  showMore: string;
  showAll: string;
  title: string;
  date: string;
  mainHeading: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  noData: string;
  yourInboxEmpty: string;
}

export interface IInboxTableColumns {
  title: string | undefined;
  width: number;
}

export interface IQATranslations {
  qaTitle: string;
  howCanWeHelpYou: string;
  checkOutOurTutorials: string;
  needMoreHelp: string;
  sendUsAMessage: string;
  callUsBtn: string;
  toContactFormBtn: string;
  callUsModalTitle: string;
  youCanContactUsBy: string;
  phoneNumber: string;
  ourOpeningHours: string;
  hoursMondayToFriday: string;
  hoursSaturday: string;
  textNoteCallUsModal: string;
  menuBills: string;
  allArticlesAboutBillsBtn: string;
  toMyBillsBtn: string;
  contactUsBtn: string;
  whereCanIFindMyAccountTitle: string;
  whereCanIFindMyAccountContent: string;
  iSignedUpButCantSeeMyAccountTitle: string;
  iSignedUpButCantSeeMyAccountContent: string;
  canIConnectMultipleEmailAddressesTitle: string;
  canIConnectMultipleEmailAddressesContent: string;
  howCanIAddAnotherEmailAddressTitle: string;
  howCanIAddAnotherEmailAddressContent: string;
  iWantToVerifyMyEmailAddressTitle: string;
  iWantToVerifyMyEmailAddressContent: string;
  iWouldLikeToReceiveACopyOfTheInvoiceTitle: string;
  iWouldLikeToReceiveACopyOfTheInvoiceContent: string;
  iWantToPayTheBillLaterTitle: string;
  iWantToPayTheBillLaterContent: string;
  whereCanISeeThatAnInvoiceIsDueTitle: string;
  whereCanISeeThatAnInvoiceIsDueContent: string;
  canIAlsoPayTheBillInInstallmentsTitle: string;
  canIAlsoPayTheBillInInstallmentsContent: string;
  iWantToDisputeAnInvoiceTitle: string;
  iWantToDisputeAnInvoiceContent: string;
  menuRegistrationOfCardsAndAccounts: string;
  allArticlesAboutCardRegistrationBtn: string;
  whatDoINeedToRegisterMyShoppingCardTitle: string;
  whatDoINeedToRegisterMyShoppingCardContent: string;
  firstLoginToMyAvailabilTitle: string;
  firstLoginToMyAvailabilContent: string;
  iHaveSeveralCardsTitle: string;
  iHaveSeveralCardsContent: string;
  menuDeliveryReturnCancellation: string;
  deliverySeeAllArticlesBtn: string;
  questionAboutDelayedOrIncorrectDeliveryTitle: string;
  questionAboutDelayedOrIncorrectDeliveryContent: string;
  iHaveAReturnQuestionTitle: string;
  iHaveAReturnQuestionContent: string;
  menuOther: string;
  otherSeeAllArticlesBtn: string;
  ihaveAlreadyPaidButMyPaymentNotRegisteredTitle: string;
  ihaveAlreadyPaidButMyPaymentNotRegisteredContent: string;
}

export interface IQaAccountsTranslations {
  heading: string;
  content: string;
  contentImage: string;
  parentLink: string;
  currentLink: string;
}

export interface IQaRegistrationCardTranslations {
  heading: string;
  content: string;
  contentImage: string;
  parentLink: string;
  currentLink: string;
}

export interface IContactUsTranslations {
  contactUsTitle: string;
  contactUsFormTitle: string;
  formName: string;
  formSurname: string;
  formEmail: string;
  formPhone: string;
  formCommunication: string;
  formSubmitButton: string;
}

export interface IDisableAccountConfirmation {
  title: string;
  description: string;
  deactivationBtn: string;
}

export interface IDisableAccountSuccess {
  title: string;
  description: string;
  deactivationBtn: string;
}
