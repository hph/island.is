import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData, useRevalidator } from 'react-router-dom'
import { useEffect } from 'react'
import { SignatureCollectionList } from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import header from '../../../assets/headerImage.svg'
import Signees from './components/signees'
import ActionExtendDeadline from './components/extendDeadline'
import ActionReviewComplete from './components/completeReview'
import PaperUpload from './components/paperUpload'

export const List = () => {
  const { list } = useLoaderData() as { list: SignatureCollectionList }
  const { revalidate } = useRevalidator()
  const { formatMessage } = useLocale()

  useEffect(() => {
    revalidate()
  }, [])

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 2]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          {!!list && (
            <>
              <IntroHeader
                title={list.owner.name + ' - ' + list.area.name}
                intro={formatMessage(m.signatureListsIntro)}
                img={header}
                imgPosition="right"
                imgHiddenBelow="sm"
              />
              <ActionExtendDeadline listId={list.id} endTime={list.endTime} />
              <Signees />
              <PaperUpload listId={list.id} />
              <ActionReviewComplete />
            </>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List