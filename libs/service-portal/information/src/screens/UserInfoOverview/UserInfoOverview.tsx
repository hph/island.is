import { Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  EmptyState,
  FootNote,
  IntroHeader,
  m,
  THJODSKRA_SLUG,
} from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'

import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { spmm } from '../../lib/messages'
import { maskString } from '@island.is/shared/utils'
import { useUserInfoOverviewQuery } from './UserInfoOverview.generated'

const UserInfoOverview = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()

  const { data, loading, error } = useUserInfoOverviewQuery({
    variables: { api: 'v3' },
  })

  const { spouse, childCustody } = data?.nationalRegistryPerson || {}

  return (
    <>
      <IntroHeader
        title={m.myInfo}
        intro={spmm.userInfoDesc}
        serviceProviderSlug={THJODSKRA_SLUG}
        serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
      />

      <Stack space={2}>
        {!loading && !error && !data?.nationalRegistryPerson ? (
          <EmptyState description={m.noDataPresent} />
        ) : (
          <FamilyMemberCard
            title={userInfo.profile.name || ''}
            nationalId={userInfo.profile.nationalId}
            currentUser
          />
        )}
        {loading && <CardLoader />}
        {spouse?.nationalId && (
          <FamilyMemberCard
            key={spouse.nationalId}
            title={spouse?.fullName || ''}
            nationalId={spouse.nationalId}
            familyRelation="spouse"
          />
        )}
        {loading &&
          [...Array(2)].map((_key, index) => <CardLoader key={index} />)}
        {childCustody?.map((child) => (
          <FamilyMemberCard
            key={child.nationalId}
            title={child.fullName || ''}
            nationalId={child.nationalId}
            baseId={
              maskString(child.nationalId, userInfo.profile.nationalId) ?? ''
            }
            familyRelation="child"
          />
        ))}
        <FootNote serviceProviderSlug={THJODSKRA_SLUG} />
      </Stack>
    </>
  )
}
export default UserInfoOverview
