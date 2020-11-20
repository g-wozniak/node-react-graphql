import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'

const data = [
  {
    name: 'Greg',
    surname: 'Wozniak',
    age: 30,
    address: {
      street: 'Example 1',
      city: 'Szczecin'
    }
  },
  {
    name: 'Tom',
    surname: 'Doe',
    age: 22,
    address: {
      street: 'Example 938',
      city: 'London'
    }
  }
]

const UsersType = new GraphQLObjectType({
  name: 'Users',
  fields: () => ({
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    age: { type: GraphQLInt },
    address: { type: AddressType }
  })
})

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UsersType),
      resolve: (parent, args) => {
        return data
      }
    },
    oldUsers: {
      type: new GraphQLList(UsersType),
      args: {
        age: { type: GraphQLInt }
      },
      resolve: (parent, args) => {
        const result = data.filter((user: any) => user.age >= args.age)
        console.log(result)
        return result
      }
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery
})