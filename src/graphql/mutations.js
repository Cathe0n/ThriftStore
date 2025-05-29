// /src/graphql/mutations.js
import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      email
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryType: String!) {
    getProductbyCategory(category_type: $categoryType) {
      id
      product_name
      price
      imagePath
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    getProductbyId(id: $id) {
      id
      product_name
      price
      imagePath
      description
      category_type
      stock
    }
  }
`;
