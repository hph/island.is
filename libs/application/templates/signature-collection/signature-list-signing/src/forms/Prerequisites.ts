import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

import { m } from '../lib/messages'
import { CanSignApi, GetListApi } from '../dataProviders/index'

export const Prerequisites: Form = buildForm({
  id: 'SignListPrerequisites',
  title: '',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'intro',
      title: m.intro,
      children: [
        buildMultiField({
          id: 'intro',
          title: m.introTitle,
          description: m.introDescription,
          children: [
            buildDescriptionField({
              id: 'introText',
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveExternalData',
      title: m.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollection,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckbox,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: m.dataCollectionSubmit,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.userProfileProviderTitle,
              subTitle: m.userProfileProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.nationalRegistryProviderTitle,
              subTitle: m.nationalRegistryProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: CanSignApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: GetListApi,
              title: '',
              subTitle: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'screen3',
      title: m.information,
      children: [],
    }),
    buildSection({
      id: 'screen4',
      title: m.listSignedShort,
      children: [],
    }),
  ],
})
