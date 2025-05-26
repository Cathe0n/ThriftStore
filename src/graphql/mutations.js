// src/graphql/mutations.js
import { gql } from '@apollo/client';

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryType: String!) {
    getProductbyCategory(category_type: $categoryType) {
      id
      product_name
      price
      gender
      brand
      imagePath
    }
  }
`;