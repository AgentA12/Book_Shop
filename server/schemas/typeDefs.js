const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }

  type Query {
    me: User
    user: [User]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      authors: [String]
      description: String
      title: String
      bookId: ID
      image: String
    ): User

    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;

//why dont u work 
// input bookInput {
//   authors: [String]
//   description: String
//   title: String
//   bookId: String
//   image: String
//   link: String
// }