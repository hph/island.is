import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { Buisness, BuisnessAssetsData, BuisnessDebtData } from '../../types'

export const business = buildSection({
  id: 'business',
  title: m.business,
  children: [
    buildSubSection({
      id: 'businessAssets',
      title: m.businessAssets,
      children: [
        buildMultiField({
          id: 'businessAssets',
          title: m.businessTitle,
          description: m.businessDescription,
          children: [
            buildDescriptionField({
              id: 'businessAssetsTitle',
              title: m.businessAssets,
              description: m.businessAssetsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'business.businessAssets.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'business.businessAssets.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.businessAsset.defaultMessage,
                    id: 'businessAsset',
                  },
                  {
                    title: m.businessAssetAmount.defaultMessage,
                    id: 'businessAssetValue',
                    required: true,
                    currency: true,
                    width: 'half',
                  },
                ],
                repeaterButtonText:
                  m.businessAssetRepeaterButton.defaultMessage,
                sumField: 'businessAssetValue',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'businessDebts',
      title: m.businessDebtsTitle,
      children: [
        buildMultiField({
          id: 'businessDebts',
          title: m.businessTitle,
          description: m.businessDescription,
          children: [
            buildDescriptionField({
              id: 'businessDebtsTitle',
              title: m.businessDebts,
              description: m.businessDebtsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'business.businessDebts.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'business.businessDebts.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.debtsCreditorName.defaultMessage,
                    id: 'businessDebt',
                  },
                  {
                    title: m.creditorsNationalId.defaultMessage,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.debtsLoanIdentity.defaultMessage,
                    id: 'loanIdentity',
                  },
                  {
                    title: m.debtsBalance.defaultMessage,
                    id: 'debtValue',
                    required: true,
                    currency: true,
                    width: 'half',
                  },
                ],
                repeaterButtonText: m.debtsRepeaterButton.defaultMessage,
                sumField: 'debtValue',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'businessOverview',
      title: m.businessOverview,
      children: [
        buildMultiField({
          id: 'businessOverview',
          title: m.businessOverview,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewBusinessAssets',
              title: m.businessAssets,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildCustomField(
              {
                title: '',
                id: 'buisnessAssetsCards',
                component: 'Cards',
                doesNotRequireAnswer: true,
              },
              {
                cards: ({ answers }: Application) => {
                  const buisnessProperty = (
                    answers.business as unknown as Buisness
                  ).businessAssets.data
                  return (
                    buisnessProperty.map((asset: BuisnessAssetsData) => ({
                      title: asset.businessAsset,
                      description: [
                        m.businessAssetAmount.defaultMessage +
                          ': ' +
                          (asset.businessAssetValue
                            ? formatCurrency(asset.businessAssetValue)
                            : '0 kr.'),
                      ],
                    })) ?? []
                  )
                },
              },
            ),
            buildKeyValueField({
              label: m.totalAmount,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    getValueViaPath(answers, 'business.businessAssets.total'),
                  ),
                ),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewBusinessDebts',
              title: m.businessDebts,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildCustomField(
              {
                title: '',
                id: 'buisnessDebtsCards',
                component: 'Cards',
                doesNotRequireAnswer: true,
              },
              {
                cards: ({ answers }: Application) => {
                  const buisnessDebts = (
                    answers.business as unknown as Buisness
                  ).businessDebts.data
                  return (
                    buisnessDebts.map((debt: BuisnessDebtData) => ({
                      title: debt.businessDebt,
                      description: [
                        `${m.creditorsNationalId.defaultMessage}: ${debt.nationalId}`,
                        m.businessAssetAmount.defaultMessage +
                          ': ' +
                          (debt.debtValue
                            ? formatCurrency(debt.debtValue)
                            : '0 kr.'),
                      ],
                    })) ?? []
                  )
                },
              },
            ),
            buildKeyValueField({
              label: m.totalAmount,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    getValueViaPath(answers, 'business.businessDebts.total'),
                  ),
                ),
            }),
            buildDividerField({}),
            buildCustomField({
              title: '',
              id: 'business.businessTotal',
              doesNotRequireAnswer: true,
              component: 'CalculateTotalBusiness',
            }),
          ],
        }),
      ],
    }),
  ],
})
