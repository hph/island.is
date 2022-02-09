import faker from 'faker'

import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import {
  makeInvestigationCase,
  makeCourt,
} from '@island.is/judicial-system/formatters'

import { intercept } from '../../../utils'

describe('/domur/rannsoknarheimild/fyrirtaka/:id', () => {
  beforeEach(() => {
    cy.login()
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.stubAPIResponses()

    intercept(caseDataAddition)
  })

  it('should display case comments', () => {
    const caseData = makeInvestigationCase()
    const comment = faker.lorem.sentence(1)
    const caseDataAddition: Case = {
      ...caseData,
      comments: comment,
    }

    cy.visit('/domur/rannsoknarheimild/fyrirtaka/test_id_stadfest')
    intercept(caseDataAddition)

    cy.contains(comment)
  })

  it('should allow users to choose if they send COURT_DATE notification', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      // judge: makeJudge(),
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.visit('/domur/rannsoknarheimild/fyrirtaka/test_id_stadfest')
    intercept(caseDataAddition)

    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.get('[name="session-arrangements-all-present"]').click()
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('be.visible')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.visit('/domur/rannsoknarheimild/fyrirtaka/test_id_stadfest')
    intercept(caseDataAddition)

    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.get('[name="session-arrangements-all-present"]').click()
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', '/domur/rannsoknarheimild/thingbok')
  })

  it('should hide the next button and show a info panel instead if the current user does not have access to continue', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      state: CaseState.RECEIVED,
      type: CaseType.INTERNET_USAGE,
    }

    cy.visit('/domur/rannsoknarheimild/fyrirtaka/test_id_stadfest')
    intercept(caseDataAddition)

    cy.getByTestid('infobox').should('exist')
    cy.getByTestid('continueButton').should('not.exist')
  })
})
