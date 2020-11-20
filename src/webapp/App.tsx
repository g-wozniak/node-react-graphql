import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import Users from './Users'

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql'
})
class App extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div>
        <h1>GraphQL example</h1>
        <h3>Monorepo</h3>
        <Users />
      </div>
    )
  }
}

ReactDOM.render(
  <ApolloProvider client={client}><App /></ApolloProvider>,
  document.getElementById('app') as HTMLElement
)