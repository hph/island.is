import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import OwnerView from './CandidateView'
import SigneeView from './SigneeView'
import { useIsOwner } from '../hooks'

const SignatureLists = () => {
  useNamespaces('sp.signatureCollection')

  const { isOwner, loadingIsOwner } = useIsOwner()

  return (
    <div>
      {!loadingIsOwner && (
        <Box>{isOwner.success ? <OwnerView /> : <SigneeView />}</Box>
      )}
    </div>
  )
}

export default SignatureLists
