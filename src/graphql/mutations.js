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

export const GET_PRODUCTS_BY_BRAND = gql`
  query getProductbyBrand($brand: String!) {
    getProductbyBrand(brand: $brand) {
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
      brand
      category_type
      Total_stock
    }
  }
`;

export const GET_PRODUCT_SIZE_STOCK = gql`
  query getProductbySize($product_id: String!, $size_type: String!) {
    getProductbySize(product_id: $product_id, size_type: $size_type) {
      stock_amount
    }
  }
`;