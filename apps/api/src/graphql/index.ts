import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import merge from 'lodash/merge'
import rootTypeDefs from './typeDefs'
import domains from './domains'
import { createContext } from './context'

const resolvers = domains.reduce(
  (combinedDomains, currentDomain) =>
    merge(currentDomain.resolvers, combinedDomains),
  {},
)

const typeDefs = [rootTypeDefs, ...domains.map((domain) => domain.typeDefs)]

const createServer = (app: Express) => {
  const enablePlayground =
    process.env.NODE_ENV === 'development' ||
    process.env.GQL_PLAYGROUND_ENABLED === '1'

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: createContext,
    playground: enablePlayground,
    introspection: enablePlayground,
  })

  server.applyMiddleware({ app, path: '/graphql' })
}

export default createServer
