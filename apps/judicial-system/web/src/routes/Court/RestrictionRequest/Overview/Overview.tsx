import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  FormFooter,
  PageLayout,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import * as Constants from '@island.is/judicial-system/consts'
import OverviewForm from './OverviewForm'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import { useRulingAutofill } from '@island.is/judicial-system-web/src/components/RulingInput/RulingInput'

export const JudgeOverview: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const router = useRouter()
  const id = router.query.id

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useRulingAutofill(isCaseUpToDate, workingCase)
  const { uploadState } = useCourtUpload(workingCase, setWorkingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.JUDGE_OVERVIEW}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <OverviewForm workingCase={workingCase} setWorkingCase={setWorkingCase} />
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`}
          nextUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`}
          nextIsDisabled={uploadState === UploadState.UPLOADING}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default JudgeOverview
