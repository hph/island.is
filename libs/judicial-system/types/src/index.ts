export { Feature } from './lib/feature'

export { Gender } from './lib/defendant'

export { InstitutionType } from './lib/institution'
export { NotificationType } from './lib/notification'
export { EventType } from './lib/eventLog'

export { CaseFileState, CaseFileCategory } from './lib/file'

export {
  UserRole,
  prosecutionRoles,
  isProsecutionUser,
  districtCourtRoles,
  isDistrictCourtUser,
  courtOfAppealsRoles,
  isCourtOfAppealsUser,
  prisonSystemRoles,
  isPrisonSystemUser,
  defenceRoles,
  isDefenceUser,
  isAdminUser,
  isCoreUser,
} from './lib/user'
export type { User } from './lib/user'

export {
  CaseOrigin,
  CaseType,
  IndictmentSubtype,
  CaseState,
  CaseTransition,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseDecision,
  CaseAppealRulingDecision,
  RequestSharedWithDefender,
  DefendantPlea,
  SessionArrangements,
  restrictionCases,
  investigationCases,
  indictmentCases,
  isIndictmentCase,
  isRestrictionCase,
  isInvestigationCase,
  isAcceptingCaseDecision,
  completedCaseStates,
  isCompletedCase,
  CaseAppealState,
  getStatementDeadline,
  prosecutorCanSelectDefenderForInvestigationCase,
} from './lib/case'
export type {
  CrimeScene,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from './lib/case'

export {
  IndictmentCountOffense,
  Substance,
  offenseSubstances,
} from './lib/indictmentCount'

export { type Lawyer, mapToLawyer } from './lib/defender'

export type { SubstanceMap } from './lib/indictmentCount'

export type { CourtDocument } from './lib/courtDocument'
