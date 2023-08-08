import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import loginScreen from '@island.is/web/screens/Login/Login'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(loginScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
