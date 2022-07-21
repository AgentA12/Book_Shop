import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
export const SAVE_BOOK = gql`
  mutation saveBook($_id: String!, $input: bookInput!) {
    saveBook(_id: $_id, bookInput: $input) {
      user {
        username
        saveBooks {
          title
          ID
        }
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation saveBook($bookId: String!, $_id: ID!) {
    saveBook(bookId: $bookId, _id: $_id) {
      user {
        username
        saveBooks {
          title
          ID
        }
      }
    }
  }
`;
