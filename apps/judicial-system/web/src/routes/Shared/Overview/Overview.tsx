import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardActiveIndictment,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { titles, core } from '@island.is/judicial-system-web/messages'
import { Box } from '@island.is/island-ui/core'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseFileCategory,
  completedCaseStates,
  UserRole,
} from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import { overview as m } from './Overview.strings'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'

const Overview = () => {
  const router = useRouter()
  const id = router.query.id
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { user } = useContext(UserContext)
  const { onOpen } = useFileList({ caseId: workingCase.id })
  const { formatMessage } = useIntl()

  const caseIsClosed = completedCaseStates.includes(workingCase.state)
  const isDefender = router.pathname.includes(constants.DEFENDER_ROUTE)

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={caseIsClosed ? Sections.CASE_CLOSED : Sections.JUDGE}
      activeSubSection={
        isDefender ? undefined : IndictmentsCourtSubsections.JUDGE_OVERVIEW
      }
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.court.indictments.overview)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          {caseIsClosed ? (
            <InfoCardClosedIndictment />
          ) : (
            <InfoCardActiveIndictment />
          )}
        </Box>
        {workingCase.caseFiles && (
          <Box component="section" marginBottom={10}>
            <SectionHeading title={formatMessage(m.caseFilesTitle)} />
            {workingCase.caseFiles
              .filter((f) => {
                if (
                  caseIsClosed ||
                  user?.role === UserRole.JUDGE ||
                  user?.role === UserRole.REGISTRAR
                ) {
                  return true
                } else {
                  if (
                    f.category === CaseFileCategory.RULING ||
                    f.category === CaseFileCategory.COURT_RECORD
                  ) {
                    return false
                  } else {
                    return true
                  }
                }
              })
              .map((file) => {
                return (
                  <Box
                    key={file.id}
                    borderColor="blue200"
                    borderBottomWidth={'large'}
                  >
                    <PdfButton
                      renderAs="row"
                      caseId={workingCase.id}
                      title={file.name}
                      handleClick={() => onOpen(file.id)}
                    />
                  </Box>
                )
              })}
          </Box>
        )}
      </FormContentContainer>
      {!caseIsClosed && !isDefender && (
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={`${constants.CASES_ROUTE}`}
            nextIsLoading={isLoadingWorkingCase}
            nextUrl={`${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`}
            nextButtonText={formatMessage(core.continue)}
          />
        </FormContentContainer>
      )}
    </PageLayout>
  )
}

export default Overview
