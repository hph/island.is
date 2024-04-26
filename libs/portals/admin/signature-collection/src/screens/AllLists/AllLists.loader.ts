import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  AllListsDocument,
  AllListsQuery,
} from './graphql/getAllSignatureLists.generated'
import {
  SignatureCollection,
  SignatureCollectionList,
} from '@island.is/api/schema'
import {
  CollectionDocument,
  CollectionQuery,
} from './graphql/getCollectionStatus.generated'

export interface ListsLoaderReturn {
  allLists: SignatureCollectionList[]
  collectionStatus: string
  collection: SignatureCollection
}

export const listsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({
    params,
  }): Promise<{
    allLists: SignatureCollectionList[]
    collectionStatus: string
    collection: SignatureCollection
  }> => {
    const { data: collectionStatusData } = await client.query<CollectionQuery>({
      query: CollectionDocument,
      fetchPolicy: 'network-only',
    })
    const collection = collectionStatusData?.signatureCollectionAdminCurrent
    const { data } = await client.query<AllListsQuery>({
      query: AllListsDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          collectionId: collection?.id,
        },
      },
    })

    const allLists = data?.signatureCollectionAdminLists ?? []
    const collectionStatus =
      collectionStatusData?.signatureCollectionAdminCurrent?.status

    return { allLists, collectionStatus, collection }
  }
}
