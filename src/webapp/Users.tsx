import * as React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const USERS_QUERY = gql`
  query UsersQuery {
    users {
      name,
      surname
    }
  }
`

class Users extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div>
        <Query query={USERS_QUERY}>
          {
            (args) => {
              const { loading, error, data } = args
              if (loading) { return <div>Loading...</div> }
              if (error) { console.log(error) }
              return (
                <ul>
                  {data.users.map((item: any, index: number) => <li key={`i_${index}`}>{item.name} {item.surname}</li>)}
                </ul>
              )
            }
          }
        </Query>
      </div>
    )
  }
}

export default Users
