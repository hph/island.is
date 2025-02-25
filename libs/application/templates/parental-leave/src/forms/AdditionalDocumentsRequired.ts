import {
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { FILE_SIZE_LIMIT } from '../constants'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'
import WomanWithLaptopIllustration from '../assets/Images/WomanWithLaptopIllustration'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'ParentalLeaveInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'reviewUpload',
      title: parentalLeaveFormMessages.attachmentScreen.title,
      children: [
        buildMultiField({
          id: 'uploadAdditionalFilesInfoScreen',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          description:
            parentalLeaveFormMessages.attachmentScreen
              .additionalDocumentRequired,
          children: [
            buildImageField({
              id: 'additionalDocumentsScreen.image',
              title: '',
              image: WomanWithLaptopIllustration,
              imageWidth: 'auto',
            }),
            buildCustomField({
              id: 'uploadAdditionalFilesInfoScreen',
              title: parentalLeaveFormMessages.attachmentScreen.title,
              component: 'UploadAdditionalFilesInfoScreen',
            }),
          ],
        }),
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          description: parentalLeaveFormMessages.attachmentScreen.description,
          children: [
            buildFileUploadField({
              id: 'fileUpload.additionalDocuments',
              title: '',
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
            buildSubmitField({
              id: 'additionalDocumentsSubmit',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .additionalDocumentsEditSubmit,
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: parentalLeaveFormMessages.attachmentScreen
                    .additionalDocumentsEditSubmit,
                  type: 'primary',
                  event: DefaultEvents.APPROVE,
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
