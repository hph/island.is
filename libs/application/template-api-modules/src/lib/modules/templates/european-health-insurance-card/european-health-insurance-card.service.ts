import { Inject, Injectable } from '@nestjs/common'
import { EhicApi } from '@island.is/clients/ehic-client-v1'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  CardResponse,
  TempData,
  NationalRegistry,
  ApplicantCard,
  CardType,
  FormApplyType,
  Answer,
} from './types'
import { TemplateApiModuleActionProps } from '../../../types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class EuropeanHealthInsuranceCardService extends BaseTemplateApiService {
  constructor(
    private readonly ehicApi: EhicApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super(ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD)
  }

  /** Helper function. Get's applicants by type. If no type is provided then it returns from national registry */
  getApplicants(
    application: ApplicationWithAttachments,
    applyType: string | null = null,
  ): string[] {
    // Get from national registry
    if (!applyType) {
      const nridArr: string[] = []
      const userData = application.externalData.nationalRegistry
        ?.data as NationalRegistry

      if (userData?.nationalId) {
        nridArr.push(userData.nationalId)
      }

      const spouseData = application?.externalData?.nationalRegistrySpouse
        ?.data as NationalRegistry
      if (spouseData?.nationalId) {
        nridArr.push(spouseData.nationalId)
      }

      const custodyData = application?.externalData?.childrenCustodyInformation
        .data as NationalRegistry[]
      for (let i = 0; i < custodyData?.length; i++) {
        nridArr.push(custodyData[i].nationalId)
      }
      return nridArr
    }

    if (applyType === FormApplyType.APPLYING_FOR_PLASTIC) {
      const ans = (application.answers as unknown) as Answer
      return ans.delimitations.applyForPlastic
    }

    return application.answers[applyType] as string[]
  }

  toCommaDelimitedList(arr: string[]) {
    let listString = ''
    for (let i = 0; i < arr.length; i++) {
      listString += arr[i]
      if (i !== arr.length - 1) {
        listString += ','
      }
    }
    return listString
  }

  /** Get's applicants that want a temporary card (PDF) and their current physical (plastic) card number */
  getPDFApplicantsAndCardNumber(
    application: ApplicationWithAttachments,
  ): ApplicantCard[] {
    const pdfApplicantArr: ApplicantCard[] = []

    const applicants = this.getApplicants(
      application,
      FormApplyType.APPLYING_FOR_PDF,
    )

    // Initial card Response
    const cardResponse = application.externalData.cardResponse
      ?.data as CardResponse[]
    // New card response
    const newPlasticCardsResponse = application.externalData
      .applyForCardsResponse?.data as CardResponse[]

    if (applicants) {
      for (let i = 0; i < applicants.length; i++) {
        if (newPlasticCardsResponse && newPlasticCardsResponse.length > 0) {
          const newCardResponse = newPlasticCardsResponse.find(
            (x) => x.applicantNationalId === applicants[i],
          )
          if (newCardResponse) {
            const plasticCard = newCardResponse?.cards?.find(
              (x) => x.isPlastic === true,
            )
            if (plasticCard) {
              pdfApplicantArr.push({
                cardNumber: plasticCard.cardNumber ?? '',
                nationalId: applicants[i],
              })
              continue
            }
          }
        }

        const currentCardResponse = cardResponse.find(
          (x) => x.applicantNationalId === applicants[i],
        )
        if (currentCardResponse) {
          const plasticCard = currentCardResponse?.cards?.find(
            (x) => x.isPlastic === true,
          )
          if (plasticCard) {
            pdfApplicantArr.push({
              cardNumber: plasticCard?.cardNumber ?? '',
              nationalId: applicants[i],
            })
          }
        }
      }
    }

    return pdfApplicantArr
  }

  async getCardResponse({ auth, application }: TemplateApiModuleActionProps) {
    const nridArr = this.getApplicants(application)
    const resp = await this.ehicApi
      .withMiddleware(new AuthMiddleware(auth as Auth))
      .cardStatus({
        applicantnationalids: this.toCommaDelimitedList(nridArr),
      })

    if (!resp) {
      this.logger.error('EHIC.API response empty from getCardResponse', resp)
    }

    return resp
  }

  async applyForPhysicalAndTemporary(obj: TemplateApiModuleActionProps) {
    const result = await this.applyForPhysicalCard(obj)
    await this.applyForTemporaryCard(obj)
    return result
  }

  async applyForPhysicalCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const applicants = this.getApplicants(
      application,
      FormApplyType.APPLYING_FOR_PLASTIC,
    )
    const cardResponses: CardResponse[] = []

    for (let i = 0; i < applicants?.length; i++) {
      const res = await this.ehicApi
        .withMiddleware(new AuthMiddleware(auth as Auth))
        .requestCard({
          applicantnationalid: applicants[i],
          cardtype: CardType.PLASTIC,
        })
      cardResponses.push(res)
    }
    return cardResponses
  }

  async applyForTemporaryCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const applicants = this.getApplicants(
      application,
      FormApplyType.APPLYING_FOR_PDF,
    )

    for (let i = 0; i < applicants?.length; i++) {
      await this.ehicApi
        .withMiddleware(new AuthMiddleware(auth as Auth))
        .requestCard({
          applicantnationalid: applicants[i],
          cardtype: CardType.PDF,
        })
    }
  }

  async getTemporaryCard({ auth, application }: TemplateApiModuleActionProps) {
    const applicants = this.getPDFApplicantsAndCardNumber(application)
    const pdfArray: TempData[] = []

    for (let i = 0; i < applicants?.length; i++) {
      const res = await this.ehicApi
        .withMiddleware(new AuthMiddleware(auth as Auth))
        .fetchTempPDFCard({
          applicantnationalid: applicants[i].nationalId ?? '',
          cardnumber: applicants[i].cardNumber ?? '',
        })
      pdfArray.push(res)
    }
    return pdfArray
  }
}