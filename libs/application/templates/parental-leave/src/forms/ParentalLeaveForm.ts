import addDays from 'date-fns/addDays'

import {
  buildAlertMessageField,
  buildAsyncSelectField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  NO_ANSWER,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'

import { parentalLeaveFormMessages } from '../lib/messages'
import {
  getAllPeriodDates,
  getSelectedChild,
  requiresOtherParentApproval,
  isParentWithoutBirthParent,
  getApplicationAnswers,
  allowOtherParent,
  getApplicationExternalData,
  getMaxMultipleBirthsDays,
  getDurationTitle,
  getFirstPeriodTitle,
  getLeavePlanTitle,
  getPeriodSectionTitle,
  getRatioTitle,
  getRightsDescTitle,
  getStartDateDesc,
  getStartDateTitle,
  getMultipleBirthRequestDays,
  getMinimumStartDate,
  allowOtherParentToUsePersonalAllowance,
  getBeginningOfMonth3MonthsAgo,
  getOtherParentOptions,
} from '../lib/parentalLeaveUtils'
import {
  GetPensionFunds,
  GetUnions,
  GetPrivatePensionFunds,
} from '../graphql/queries'
import {
  FILE_SIZE_LIMIT,
  MANUAL,
  SPOUSE,
  NO,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  ParentalRelations,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  SINGLE,
  StartDateOptions,
  UnEmployedBenefitTypes,
  YES,
  PERMANENT_FOSTER_CARE,
  ADOPTION,
} from '../constants'
import Logo from '../assets/Logo'
import { minPeriodDays } from '../config'
import {
  GetPensionFundsQuery,
  GetPrivatePensionFundsQuery,
  GetUnionsQuery,
} from '../types/schema'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'

export const ParentalLeaveForm: Form = buildForm({
  id: 'ParentalLeaveDraft',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: parentalLeaveFormMessages.shared.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'theApplicant',
      title: parentalLeaveFormMessages.shared.applicantSection,
      children: [
        buildSubSection({
          id: 'emailAndPhoneNumber',
          title: parentalLeaveFormMessages.applicant.subSection,
          children: [
            buildMultiField({
              id: 'infoSection',
              title: parentalLeaveFormMessages.applicant.subSection,
              children: [
                buildDescriptionField({
                  id: 'contactInfo',
                  title: parentalLeaveFormMessages.applicant.title,
                  titleVariant: 'h4',
                  description: parentalLeaveFormMessages.applicant.description,
                }),
                buildTextField({
                  width: 'half',
                  title: parentalLeaveFormMessages.applicant.email,
                  dataTestId: 'email',
                  id: 'applicant.email',
                  variant: 'email',
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.userProfile?.data as {
                        email?: string
                      }
                    )?.email,
                }),
                buildTextField({
                  width: 'half',
                  title: parentalLeaveFormMessages.applicant.phoneNumber,
                  defaultValue: (application: Application) => {
                    const phoneNumber = (
                      application.externalData.userProfile?.data as {
                        mobilePhoneNumber?: string
                      }
                    )?.mobilePhoneNumber

                    return formatPhoneNumber(
                      removeCountryCode(phoneNumber ?? ''),
                    )
                  },
                  id: 'applicant.phoneNumber',
                  dataTestId: 'phone',
                  variant: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                }),
                buildRadioField({
                  id: 'applicant.language',
                  title: parentalLeaveFormMessages.applicant.languageTitle,
                  width: 'half',
                  space: 3,
                  options: [
                    {
                      value: '',
                      label: parentalLeaveFormMessages.applicant.icelandic,
                    },
                    {
                      value: 'EN',
                      label: parentalLeaveFormMessages.applicant.english,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParentObj',
          title: parentalLeaveFormMessages.shared.otherParentSubSection,
          condition: (answers, externalData) => {
            const selectedChild = getSelectedChild(answers, externalData)

            if (selectedChild !== null) {
              return (
                selectedChild.parentalRelation === ParentalRelations.primary
              )
            }

            return true
          },
          children: [
            buildMultiField({
              id: 'otherParentObj',
              title: parentalLeaveFormMessages.shared.otherParentTitle,
              description:
                parentalLeaveFormMessages.shared.otherParentDescription,
              children: [
                buildRadioField({
                  id: 'otherParentObj.chooseOtherParent',
                  title: parentalLeaveFormMessages.shared.otherParentSubTitle,
                  options: (application) => getOtherParentOptions(application),
                }),
                buildTextField({
                  id: 'otherParentObj.otherParentName',
                  dataTestId: 'other-parent-name',
                  condition: (answers) =>
                    (
                      answers as {
                        otherParentObj: {
                          chooseOtherParent: string
                        }
                      }
                    )?.otherParentObj?.chooseOtherParent === MANUAL,
                  title: parentalLeaveFormMessages.shared.otherParentName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'otherParentObj.otherParentId',
                  dataTestId: 'other-parent-kennitala',
                  condition: (answers) =>
                    (
                      answers as {
                        otherParentObj: {
                          chooseOtherParent: string
                        }
                      }
                    )?.otherParentObj?.chooseOtherParent === MANUAL,
                  title: parentalLeaveFormMessages.shared.otherParentID,
                  width: 'half',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
              ],
            }),
            buildRadioField({
              id: 'otherParentRightOfAccess',
              condition: (answers) =>
                (
                  answers as {
                    otherParentObj: {
                      chooseOtherParent: string
                    }
                  }
                )?.otherParentObj?.chooseOtherParent === MANUAL,
              title: parentalLeaveFormMessages.rightOfAccess.title,
              description: parentalLeaveFormMessages.rightOfAccess.description,
              defaultValue: YES,
              options: [
                {
                  label: parentalLeaveFormMessages.rightOfAccess.yesOption,
                  dataTestId: 'yes-option',
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.rightOfAccess.noOption,
                  dataTestId: 'no-option',
                  value: NO,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payments',
          title: parentalLeaveFormMessages.shared.paymentInformationSubSection,
          children: [
            buildMultiField({
              title: parentalLeaveFormMessages.shared.paymentInformationName,
              id: 'payments',
              children: [
                buildTextField({
                  title:
                    parentalLeaveFormMessages.shared.paymentInformationBank,
                  id: 'payments.bank',
                  dataTestId: 'bank-account-number',
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.userProfile?.data as {
                        bankInfo?: string
                      }
                    )?.bankInfo,
                }),
                buildAsyncSelectField({
                  condition: (answers) => {
                    const { applicationType } = getApplicationAnswers(answers)

                    return applicationType === PARENTAL_LEAVE
                  },
                  title: parentalLeaveFormMessages.shared.pensionFund,
                  id: 'payments.pensionFund',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  isSearchable: true,
                  dataTestId: `pension-fund`,
                  placeholder:
                    parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } =
                      await apolloClient.query<GetPensionFundsQuery>({
                        query: GetPensionFunds,
                      })

                    return (
                      data?.getPensionFunds?.map(({ id, name }) => ({
                        label: name,
                        dataTestId: 'pension-fund-item',
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildRadioField({
                  id: 'payments.useUnion',
                  title: parentalLeaveFormMessages.shared.unionName,
                  description:
                    parentalLeaveFormMessages.shared.unionDescription,
                  condition: (answers) => {
                    const { applicationType } = getApplicationAnswers(answers)

                    return applicationType === PARENTAL_LEAVE
                  },
                  space: 6,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-union',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-union',
                      value: NO,
                    },
                  ],
                }),
                buildAsyncSelectField({
                  condition: (answers) => {
                    const { applicationType, useUnion } =
                      getApplicationAnswers(answers)
                    return (
                      applicationType === PARENTAL_LEAVE && useUnion === YES
                    )
                  },
                  title: parentalLeaveFormMessages.shared.union,
                  id: 'payments.union',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  dataTestId: 'payments-union',
                  isSearchable: true,
                  placeholder:
                    parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<GetUnionsQuery>({
                      query: GetUnions,
                    })

                    return (
                      data?.getUnions
                        ?.filter(({ id }) => id !== NO_UNION)
                        .map(({ id, name }) => ({
                          label: name,
                          value: id,
                        })) ?? []
                    )
                  },
                }),
                buildRadioField({
                  id: 'payments.usePrivatePensionFund',
                  title:
                    parentalLeaveFormMessages.shared.privatePensionFundName,
                  description:
                    parentalLeaveFormMessages.shared
                      .privatePensionFundDescription,
                  condition: (answers) => {
                    const { applicationType } = getApplicationAnswers(answers)

                    return applicationType === PARENTAL_LEAVE
                  },
                  space: 6,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-private-pension-fund',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-private-pension-fund',
                      value: NO,
                    },
                  ],
                }),
                buildAsyncSelectField({
                  condition: (answers) => {
                    const { applicationType, usePrivatePensionFund } =
                      getApplicationAnswers(answers)
                    return (
                      applicationType === PARENTAL_LEAVE &&
                      usePrivatePensionFund === YES
                    )
                  },
                  id: 'payments.privatePensionFund',
                  title: parentalLeaveFormMessages.shared.privatePensionFund,
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  dataTestId: 'private-pension-fund',
                  isSearchable: true,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } =
                      await apolloClient.query<GetPrivatePensionFundsQuery>({
                        query: GetPrivatePensionFunds,
                      })

                    return (
                      data?.getPrivatePensionFunds
                        ?.filter(({ id }) => id !== NO_PRIVATE_PENSION_FUND)
                        .map(({ id, name }) => ({
                          label: name,
                          value: id,
                        })) ?? []
                    )
                  },
                }),
                buildSelectField({
                  condition: (answers) => {
                    const { applicationType, usePrivatePensionFund } =
                      getApplicationAnswers(answers)
                    return (
                      applicationType === PARENTAL_LEAVE &&
                      usePrivatePensionFund === YES
                    )
                  },
                  id: 'payments.privatePensionFundPercentage',
                  dataTestId: 'private-pension-fund-ratio',
                  title:
                    parentalLeaveFormMessages.shared.privatePensionFundRatio,
                  options: [
                    { label: '2%', value: '2' },
                    { label: '4%', value: '4' },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'personalAllowanceSubSection',
          title: parentalLeaveFormMessages.personalAllowance.title,
          children: [
            buildMultiField({
              id: 'personalAllowance',
              title: parentalLeaveFormMessages.personalAllowance.title,
              description:
                parentalLeaveFormMessages.personalAllowance.description,
              children: [
                buildAlertMessageField({
                  id: 'personalAllowance.alertMessage',
                  title: parentalLeaveFormMessages.employer.alertTitle,
                  message:
                    parentalLeaveFormMessages.personalAllowance
                      .alertDescription,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  marginTop: 0,
                }),
                buildRadioField({
                  id: 'personalAllowance.usePersonalAllowance',
                  title: parentalLeaveFormMessages.personalAllowance.useYours,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-personal-finance',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-personal-finance',
                      value: NO,
                    },
                  ],
                }),
                buildRadioField({
                  id: 'personalAllowance.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossible,
                  width: 'half',
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-as-much-as-possible',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-as-much-as-possible',
                      value: NO,
                    },
                  ],
                  condition: (answers) =>
                    (
                      answers as {
                        personalAllowance: { usePersonalAllowance: string }
                      }
                    )?.personalAllowance?.usePersonalAllowance === YES,
                }),
                buildTextField({
                  id: 'personalAllowance.usage',
                  title:
                    parentalLeaveFormMessages.personalAllowance.oneToHundred,
                  description:
                    parentalLeaveFormMessages.personalAllowance.manual,
                  suffix: '%',
                  condition: (answers) => {
                    const usingAsMuchAsPossible =
                      (
                        answers as {
                          personalAllowance: { useAsMuchAsPossible: string }
                        }
                      )?.personalAllowance?.useAsMuchAsPossible === NO
                    const usingPersonalAllowance =
                      (
                        answers as {
                          personalAllowance: { usePersonalAllowance: string }
                        }
                      )?.personalAllowance?.usePersonalAllowance === YES

                    return usingAsMuchAsPossible && usingPersonalAllowance
                  },
                  placeholder: '1%',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
                }),
              ],
            }),
            buildMultiField({
              id: 'personalAllowanceFromSpouse',
              title: parentalLeaveFormMessages.personalAllowance.spouseTitle,
              description:
                parentalLeaveFormMessages.personalAllowance.spouseDescription,
              condition: (answers, externalData) => {
                const selectedChild = getSelectedChild(answers, externalData)

                return (
                  selectedChild?.parentalRelation ===
                    ParentalRelations.primary &&
                  allowOtherParentToUsePersonalAllowance(answers)
                )
              },
              children: [
                buildRadioField({
                  id: 'personalAllowanceFromSpouse.usePersonalAllowance',
                  title:
                    parentalLeaveFormMessages.personalAllowance.useFromSpouse,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-personal-finance',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-personal-finance',
                      value: NO,
                    },
                  ],
                }),
                buildRadioField({
                  id: 'personalAllowanceFromSpouse.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossibleFromSpouse,
                  width: 'half',
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      value: NO,
                    },
                  ],
                  condition: (answers) =>
                    (
                      answers as {
                        personalAllowanceFromSpouse: {
                          usePersonalAllowance: string
                        }
                      }
                    )?.personalAllowanceFromSpouse?.usePersonalAllowance ===
                      YES && allowOtherParent(answers),
                }),
                buildTextField({
                  id: 'personalAllowanceFromSpouse.usage',
                  title:
                    parentalLeaveFormMessages.personalAllowance.oneToHundred,
                  description:
                    parentalLeaveFormMessages.personalAllowance.manual,
                  suffix: '%',
                  condition: (answers) => {
                    const usingAsMuchAsPossible =
                      (
                        answers as {
                          personalAllowanceFromSpouse: {
                            useAsMuchAsPossible: string
                          }
                        }
                      )?.personalAllowanceFromSpouse?.useAsMuchAsPossible === NO
                    const usingPersonalAllowance =
                      (
                        answers as {
                          personalAllowanceFromSpouse: {
                            usePersonalAllowance: string
                          }
                        }
                      )?.personalAllowanceFromSpouse?.usePersonalAllowance ===
                      YES

                    return usingAsMuchAsPossible && usingPersonalAllowance
                  },
                  placeholder: '1%',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'employmentSubSection',
          title: parentalLeaveFormMessages.employer.subSection,
          condition: (answers) => {
            const { applicationType } = getApplicationAnswers(answers)
            return applicationType === PARENTAL_LEAVE
          },
          children: [
            buildMultiField({
              id: 'employment',
              title: '',
              children: [
                buildDescriptionField({
                  id: 'employment.isSelfEmployed.description',
                  title: parentalLeaveFormMessages.selfEmployed.title,
                  description:
                    parentalLeaveFormMessages.selfEmployed.description,
                  titleVariant: 'h2',
                }),
                buildRadioField({
                  id: 'employment.isSelfEmployed',
                  title: '',
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      value: NO,
                    },
                  ],
                }),
                buildDescriptionField({
                  id: 'employment.isReceivingUnemploymentBenefits.description',
                  title:
                    parentalLeaveFormMessages.employer
                      .isReceivingUnemploymentBenefitsTitle,
                  description:
                    parentalLeaveFormMessages.employer
                      .isReceivingUnemploymentBenefitsDescription,
                  titleVariant: 'h2',
                  condition: (answers) => {
                    const { isSelfEmployed } = getApplicationAnswers(answers)
                    return isSelfEmployed === NO
                  },
                }),
                buildAlertMessageField({
                  id: 'employment.isReceivingUnemploymentBenefits.alertMessage',
                  title: parentalLeaveFormMessages.employer.alertTitle,
                  message: parentalLeaveFormMessages.employer.alertDescription,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  condition: (answers) => {
                    const { isSelfEmployed } = getApplicationAnswers(answers)
                    return isSelfEmployed === NO
                  },
                }),
                buildRadioField({
                  id: 'employment.isReceivingUnemploymentBenefits',
                  title: '',
                  width: 'half',
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      value: NO,
                    },
                  ],
                  condition: (answers) => {
                    const { isSelfEmployed } = getApplicationAnswers(answers)
                    return isSelfEmployed === NO
                  },
                }),
                buildSelectField({
                  id: 'employment.unemploymentBenefits',
                  title:
                    parentalLeaveFormMessages.employer.unemploymentBenefits,
                  options: [
                    {
                      label: UnEmployedBenefitTypes.vmst,
                      value: UnEmployedBenefitTypes.vmst,
                    },
                    {
                      label: UnEmployedBenefitTypes.union,
                      value: UnEmployedBenefitTypes.union,
                    },
                    {
                      label: UnEmployedBenefitTypes.healthInsurance,
                      value: UnEmployedBenefitTypes.healthInsurance,
                    },
                    {
                      label: UnEmployedBenefitTypes.other,
                      value: UnEmployedBenefitTypes.other,
                    },
                  ],
                  condition: (answers) => {
                    const { isSelfEmployed, isReceivingUnemploymentBenefits } =
                      getApplicationAnswers(answers)

                    return (
                      isSelfEmployed === NO &&
                      isReceivingUnemploymentBenefits === YES
                    )
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          condition: (answers) => {
            const { applicationType } = getApplicationAnswers(answers)

            return (
              applicationType === PARENTAL_GRANT ||
              applicationType === PARENTAL_GRANT_STUDENTS
            )
          },
          id: 'parentalGrantEmployment',
          title: parentalLeaveFormMessages.employer.subSection,
          children: [
            buildRadioField({
              id: 'employerLastSixMonths',
              title: parentalLeaveFormMessages.employer.employerLastSixMonths,
              width: 'half',
              options: [
                {
                  value: YES,
                  label: parentalLeaveFormMessages.shared.yesOptionLabel,
                },
                {
                  value: NO,
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          condition: (answers) => {
            const {
              applicationType,
              isReceivingUnemploymentBenefits,
              isSelfEmployed,
              employerLastSixMonths,
            } = getApplicationAnswers(answers)
            const isNotSelfEmployed = isSelfEmployed !== YES

            return (
              (applicationType === PARENTAL_LEAVE &&
                isReceivingUnemploymentBenefits === NO &&
                isNotSelfEmployed) ||
              ((applicationType === PARENTAL_GRANT ||
                applicationType === PARENTAL_GRANT_STUDENTS) &&
                employerLastSixMonths === YES)
            )
          },
          id: 'employment',
          title: parentalLeaveFormMessages.employer.subSection,
          children: [
            buildRepeater({
              id: 'employers',
              title: parentalLeaveFormMessages.employer.title,
              component: 'EmployersOverview',
              children: [
                buildMultiField({
                  id: 'addEmployers',
                  title: parentalLeaveFormMessages.employer.registration,
                  isPartOfRepeater: true,
                  children: [
                    // buildCompanySearchField({
                    //   id: 'name',
                    //   title: parentalLeaveFormMessages.employer.name,
                    //   placeholder:
                    //     parentalLeaveFormMessages.employer
                    //       .nameSearchPlaceholder,
                    // }),
                    buildTextField({
                      id: 'email',
                      variant: 'email',
                      dataTestId: 'employer-email',
                      title: parentalLeaveFormMessages.employer.email,
                    }),
                    buildTextField({
                      id: 'phoneNumber',
                      variant: 'tel',
                      dataTestId: 'employer-phone-number',
                      format: '###-####',
                      placeholder: '000-0000',
                      title: parentalLeaveFormMessages.employer.phoneNumber,
                    }),
                    buildSelectField({
                      id: 'ratio',
                      dataTestId: 'employment-ratio',
                      title: parentalLeaveFormMessages.employer.ratio,
                      placeholder:
                        parentalLeaveFormMessages.employer.ratioPlaceholder,
                      options: Array(100)
                        .fill(undefined)
                        .map((_, idx, array) => ({
                          value: `${array.length - idx}`,
                          label: `${array.length - idx}%`,
                        })),
                    }),
                    buildRadioField({
                      id: 'stillEmployed',
                      condition: (answers) => {
                        const { applicationType, employerLastSixMonths } =
                          getApplicationAnswers(answers)

                        return (
                          (applicationType === PARENTAL_GRANT ||
                            applicationType === PARENTAL_GRANT_STUDENTS) &&
                          employerLastSixMonths === YES
                        )
                      },
                      title: parentalLeaveFormMessages.employer.stillEmployed,
                      width: 'half',
                      space: 3,
                      options: [
                        {
                          value: YES,
                          label:
                            parentalLeaveFormMessages.shared.yesOptionLabel,
                        },
                        {
                          value: NO,
                          label: parentalLeaveFormMessages.shared.noOptionLabel,
                        },
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUpload',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          children: [
            buildFileUploadField({
              id: 'employer.selfEmployed.file',
              title: parentalLeaveFormMessages.selfEmployed.attachmentTitle,
              description:
                parentalLeaveFormMessages.selfEmployed.attachmentDescription,
              introduction:
                parentalLeaveFormMessages.selfEmployed.attachmentDescription,
              condition: (answers) => {
                const isSelfEmployed =
                  (
                    answers as {
                      employer: {
                        isSelfEmployed: string
                      }
                    }
                  )?.employer?.isSelfEmployed === YES

                const hasOldSelfEmployedFile =
                  (
                    answers as {
                      employer: {
                        selfEmployed: {
                          file: unknown[]
                        }
                      }
                    }
                  )?.employer?.selfEmployed?.file?.length > 0

                return isSelfEmployed && hasOldSelfEmployedFile
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.selfEmployedFile',
              title: parentalLeaveFormMessages.selfEmployed.attachmentTitle,
              description:
                parentalLeaveFormMessages.selfEmployed.attachmentDescription,
              introduction:
                parentalLeaveFormMessages.selfEmployed.attachmentDescription,
              condition: (answers) => {
                const { isSelfEmployed } = getApplicationAnswers(answers)
                const hasOldSelfEmployedFile =
                  (
                    answers as {
                      employer: {
                        selfEmployed: {
                          file: unknown[]
                        }
                      }
                    }
                  )?.employer?.selfEmployed?.file?.length > 0

                return isSelfEmployed === YES && !hasOldSelfEmployedFile
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.studentFile',
              title: parentalLeaveFormMessages.attachmentScreen.studentTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.studentDescription,
              condition: (answers) =>
                (
                  answers as {
                    applicationType: {
                      option: string
                    }
                  }
                )?.applicationType?.option === PARENTAL_GRANT_STUDENTS,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.benefitsFile',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .unemploymentBenefitsTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.benefitDescription,
              condition: (answers) => {
                const {
                  isReceivingUnemploymentBenefits,
                  isSelfEmployed,
                  unemploymentBenefits,
                } = getApplicationAnswers(answers)

                return (
                  isSelfEmployed === NO &&
                  isReceivingUnemploymentBenefits === YES &&
                  (unemploymentBenefits === UnEmployedBenefitTypes.union ||
                    unemploymentBenefits ===
                      UnEmployedBenefitTypes.healthInsurance)
                )
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.singleParent',
              title:
                parentalLeaveFormMessages.attachmentScreen.singleParentTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen
                  .singleParentDescription,
              condition: (answers) =>
                (
                  answers as {
                    otherParentObj: {
                      chooseOtherParent: string
                    }
                  }
                )?.otherParentObj?.chooseOtherParent === SINGLE,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.parentWithoutBirthParent',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .parentWithoutBirthParentTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen
                  .parentWithoutBirthParentDescription,
              condition: (answers) => isParentWithoutBirthParent(answers),
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.permanentFosterCare',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .permanentFostercareTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen
                  .permanentFostercareDescription,
              condition: (answers) => {
                const { noChildrenFoundTypeOfApplication } =
                  getApplicationAnswers(answers)

                return (
                  noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE
                )
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.adoption',
              title: parentalLeaveFormMessages.attachmentScreen.adoptionTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.adoptionDescription,
              condition: (answers) => {
                const { noChildrenFoundTypeOfApplication } =
                  getApplicationAnswers(answers)

                return noChildrenFoundTypeOfApplication === ADOPTION
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.employmentTerminationCertificateFile',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .employmentTerminationCertificateTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen
                  .employmentTerminationCertificateDescription,
              condition: (answers) => {
                const {
                  applicationType,
                  employerLastSixMonths,
                  isNotStillEmployed,
                } = getApplicationAnswers(answers)

                return (
                  (applicationType === PARENTAL_GRANT ||
                    applicationType === PARENTAL_GRANT_STUDENTS) &&
                  employerLastSixMonths === YES &&
                  isNotStillEmployed
                )
              },
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.file',
              title: parentalLeaveFormMessages.attachmentScreen.title,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.description,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'rights',
      title: parentalLeaveFormMessages.shared.rightsSection,
      condition: (answers, externalData) => {
        const selectedChild = getSelectedChild(answers, externalData)
        return selectedChild?.parentalRelation === ParentalRelations.primary
      },
      children: [
        buildSubSection({
          id: 'rightsQuestions',
          title: parentalLeaveFormMessages.shared.yourRights,
          children: [
            buildMultiField({
              id: 'rightsIntro',
              title: parentalLeaveFormMessages.shared.theseAreYourRights,
              description: getRightsDescTitle,
              children: [
                buildCustomField({
                  id: 'rightsIntro',
                  doesNotRequireAnswer: true,
                  title: '',
                  component: 'Rights',
                }),
              ],
            }),
            buildCustomField({
              id: 'multipleBirthsRequestDays',
              childInputIds: [
                'multipleBirthsRequestDays',
                'requestRights.isRequestingRights',
                'requestRights.requestDays',
                'giveRights.isGivingRights',
                'giveRights.giveDays',
              ],
              title: parentalLeaveFormMessages.shared.multipleBirthsDaysTitle,
              description:
                parentalLeaveFormMessages.shared.multipleBirthsDaysDescription,
              condition: (answers, externalData) => {
                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                  ParentalRelations.primary
                const { hasMultipleBirths, otherParent } =
                  getApplicationAnswers(answers)

                return (
                  canTransferRights &&
                  hasMultipleBirths === YES &&
                  otherParent !== SINGLE
                )
              },
              component: 'RequestMultipleBirthsDaysSlider',
            }),
            buildCustomField({
              id: 'transferRights',
              childInputIds: [
                'transferRights',
                'requestRights.isRequestingRights',
                'requestRights.requestDays',
                'giveRights.isGivingRights',
                'giveRights.giveDays',
              ],
              condition: (answers, externalData) => {
                const { hasMultipleBirths, otherParent } =
                  getApplicationAnswers(answers)

                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary &&
                  (otherParent === SPOUSE || otherParent === MANUAL)

                const multipleBirthsRequestDays =
                  getMultipleBirthRequestDays(answers)

                return (
                  canTransferRights &&
                  (hasMultipleBirths === NO ||
                    multipleBirthsRequestDays ===
                      getMaxMultipleBirthsDays(answers) ||
                    multipleBirthsRequestDays === 0)
                )
              },
              title: parentalLeaveFormMessages.shared.transferRightsTitle,
              description:
                parentalLeaveFormMessages.shared.transferRightsDescription,
              component: 'TransferRights',
            }),
            buildCustomField({
              id: 'requestRights.requestDays',
              childInputIds: [
                'requestRights.isRequestingRights',
                'requestRights.requestDays',
              ],
              title:
                parentalLeaveFormMessages.shared.transferRightsRequestTitle,
              condition: (answers, externalData) => {
                const { hasMultipleBirths, otherParent } =
                  getApplicationAnswers(answers)

                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary &&
                  (otherParent === SPOUSE || otherParent === MANUAL)

                const multipleBirthsRequestDays =
                  getMultipleBirthRequestDays(answers)

                return (
                  canTransferRights &&
                  getApplicationAnswers(answers).isRequestingRights === YES &&
                  (hasMultipleBirths === NO ||
                    multipleBirthsRequestDays ===
                      getMaxMultipleBirthsDays(answers))
                )
              },
              component: 'RequestDaysSlider',
            }),
            buildCustomField({
              id: 'giveRights.giveDays',
              childInputIds: [
                'giveRights.isGivingRights',
                'giveRights.giveDays',
              ],
              title: parentalLeaveFormMessages.shared.transferRightsGiveTitle,
              condition: (answers, externalData) => {
                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary && allowOtherParent(answers)

                const { hasMultipleBirths } = getApplicationAnswers(answers)

                const multipleBirthsRequestDays =
                  getMultipleBirthRequestDays(answers)

                return (
                  canTransferRights &&
                  getApplicationAnswers(answers).isGivingRights === YES &&
                  (hasMultipleBirths === NO || multipleBirthsRequestDays === 0)
                )
              },
              component: 'GiveDaysSlider',
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParentEmailQuestion',
          title: parentalLeaveFormMessages.shared.otherParentEmailSubSection,
          condition: (answers, externalData) =>
            requiresOtherParentApproval(answers, externalData),
          children: [
            buildMultiField({
              id: 'otherParentContactInfo',
              title: parentalLeaveFormMessages.shared.otherParentEmailTitle,
              children: [
                buildTextField({
                  id: 'otherParentEmail',
                  title: parentalLeaveFormMessages.applicant.email,
                  description:
                    parentalLeaveFormMessages.shared
                      .otherParentEmailDescription,
                }),
                buildTextField({
                  id: 'otherParentPhoneNumber',
                  title: parentalLeaveFormMessages.applicant.phoneNumber,
                  variant: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                }),
              ],
            }),
          ],
        }),
        /*
        TODO: add back once payment plan is implemented
        buildSubSection({
          id: 'rightsReview',
          title: parentalLeaveFormMessages.shared.rightsSummarySubSection,
          children: [
            buildMultiField({
              id: 'reviewRights',
              title: parentalLeaveFormMessages.shared.rightsSummaryName,
              description: (application) =>
                `${formatIsk(
                  getEstimatedMonthlyPay(application),
                )} er áætluð mánaðarleg útborgun þín fyrir hvern heilan mánuð eftir skatt.`, // TODO messages
              children: [
                buildCustomField({
                  id: 'reviewRights',
                  title: '',
                  component: 'ReviewRights',
                }),
              ],
            }),
          ],
        }),
        */
      ],
    }),
    buildSection({
      id: 'leavePeriods',
      title: getPeriodSectionTitle,
      children: [
        buildSubSection({
          id: 'addPeriods',
          title: parentalLeaveFormMessages.leavePlan.subSection,
          children: [
            buildRepeater({
              id: 'periods',
              title: getLeavePlanTitle,
              component: 'PeriodsRepeater',
              children: [
                buildCustomField({
                  id: 'firstPeriodStart',
                  title: getFirstPeriodTitle,
                  condition: (answers) => {
                    const { periods } = getApplicationAnswers(answers)

                    return periods.length === 0
                  },
                  component: 'FirstPeriodStart',
                }),
                buildDateField({
                  id: 'startDate',
                  title: getStartDateTitle,
                  description: getStartDateDesc,
                  placeholder: parentalLeaveFormMessages.startDate.placeholder,
                  defaultValue: NO_ANSWER,
                  condition: (answers) => {
                    const { periods, rawPeriods } =
                      getApplicationAnswers(answers)
                    const currentPeriod = rawPeriods[rawPeriods.length - 1]
                    const firstPeriodRequestingSpecificStartDate =
                      currentPeriod?.firstPeriodStart ===
                      StartDateOptions.SPECIFIC_DATE

                    return (
                      firstPeriodRequestingSpecificStartDate ||
                      periods.length !== 0
                    )
                  },
                  minDate: (application: Application) =>
                    getMinimumStartDate(application),
                  excludeDates: (application) => {
                    const { periods } = getApplicationAnswers(
                      application.answers,
                    )

                    return getAllPeriodDates(periods)
                  },
                }),
                buildRadioField({
                  id: 'useLength',
                  title: getDurationTitle,
                  description: parentalLeaveFormMessages.duration.description,
                  defaultValue: YES,
                  options: [
                    {
                      label: parentalLeaveFormMessages.duration.monthsOption,
                      value: YES,
                    },
                    {
                      label:
                        parentalLeaveFormMessages.duration.specificDateOption,
                      value: NO,
                    },
                  ],
                }),
                buildCustomField({
                  id: 'endDate',
                  condition: (answers) => {
                    const { rawPeriods } = getApplicationAnswers(answers)
                    const period = rawPeriods[rawPeriods.length - 1]

                    return period?.useLength === YES && !!period?.startDate
                  },
                  title: getDurationTitle,
                  component: 'Duration',
                }),
                buildCustomField(
                  {
                    id: 'endDate',
                    title: parentalLeaveFormMessages.endDate.title,
                    component: 'PeriodEndDate',
                    condition: (answers) => {
                      const { rawPeriods } = getApplicationAnswers(answers)
                      const period = rawPeriods[rawPeriods.length - 1]

                      return period?.useLength === NO && !!period?.startDate
                    },
                  },
                  {
                    minDate: (application: Application) => {
                      const { rawPeriods } = getApplicationAnswers(
                        application.answers,
                      )
                      const latestStartDate =
                        rawPeriods[rawPeriods.length - 1]?.startDate

                      return addDays(
                        new Date(latestStartDate),
                        minPeriodDays - 1,
                      )
                    },
                    excludeDates: (application: Application) => {
                      const { periods } = getApplicationAnswers(
                        application.answers,
                      )

                      return getAllPeriodDates(periods)
                    },
                  },
                ),
                buildCustomField({
                  id: 'ratio',
                  title: getRatioTitle,
                  description: parentalLeaveFormMessages.ratio.description,
                  component: 'PeriodPercentage',
                  condition: (answers) => {
                    const { rawPeriods } = getApplicationAnswers(answers)
                    const period = rawPeriods[rawPeriods.length - 1]

                    return !!period?.startDate && !!period?.endDate
                  },
                }),
              ],
            }),
          ],
        }),
        // TODO: Bring back payment calculation info, once we have an api
        // app.asana.com/0/1182378413629561/1200214178491335/f
        // buildSubSection({
        //   id: 'paymentPlan',
        //   title: parentalLeaveFormMessages.paymentPlan.subSection,
        //   children: [
        //     buildCustomField(
        //       {
        //         id: 'paymentPlan',
        //         title: parentalLeaveFormMessages.paymentPlan.title,
        //         description: parentalLeaveFormMessages.paymentPlan.description,
        //         component: 'PaymentSchedule',
        //       },
        //       {},
        //     ),
        //   ],
        // }),

        // TODO: Bring back this feature post v1 launch
        // https://app.asana.com/0/1182378413629561/1200214178491339/f
        // buildSubSection({
        //   id: 'shareInformation',
        //   title: parentalLeaveFormMessages.shareInformation.subSection,
        //   condition: (answers) => answers.otherParent !== NO,
        //   children: [
        //     buildRadioField({
        //       id: 'shareInformationWithOtherParent',
        //       title: parentalLeaveFormMessages.shareInformation.title,
        //       description:
        //         parentalLeaveFormMessages.shareInformation.description,
        //       options: [
        //         {
        //           label: parentalLeaveFormMessages.shareInformation.yesOption,
        //           value: YES,
        //         },
        //         {
        //           label: parentalLeaveFormMessages.shareInformation.noOption,
        //           value: NO,
        //         },
        //       ],
        //     }),
        //   ],
        // }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: parentalLeaveFormMessages.confirmation.section,
      children: [
        buildSubSection({
          title: '',
          children: [
            buildMultiField({
              id: 'confirmation',
              title: '',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmationScreen',
                    title: '',
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
                buildSubmitField({
                  id: 'submit',
                  placement: 'footer',
                  title: parentalLeaveFormMessages.confirmation.title,
                  actions: [
                    {
                      event: 'SUBMIT',
                      name: parentalLeaveFormMessages.confirmation.title,
                      type: 'primary',
                      condition: (answers, externalData) => {
                        const { applicationFundId } =
                          getApplicationExternalData(externalData)
                        if (!applicationFundId || applicationFundId === '') {
                          const { periods } = getApplicationAnswers(answers)
                          return (
                            periods.length > 0 &&
                            new Date(periods[0].startDate) >=
                              addDays(getBeginningOfMonth3MonthsAgo(), -1)
                          )
                        }

                        return true
                      },
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: parentalLeaveFormMessages.finalScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
