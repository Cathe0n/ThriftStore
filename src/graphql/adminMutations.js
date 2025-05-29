import { gql } from '@apollo/client';

// login for admin
export const ADMIN_LOGIN_MUTATION = gql`
  mutation Login_A($email: String!, $password: String!) {
    login_A(email: $email, password: $password) {
      token
    }
  }
`;
export const GET_ALL_PRODUCTS = gql`
  query {
    getAllProducts {
      product_name
      gender
      price
      discount_rate
      category_type
      sold_amount
      Total_stock
      imagePath
      brand
      description
    }
  }
`;
// add new product
export const ADMIN_CREATE_PRODUCT = gql`
  mutation createProduct($product_name: String!,$gender:String!,$price:Float!,$discount_rate:Float!,$category_type:String!,$imagePath:String!,$brand:String!) 
  { createProduct(product_name:$product_name,gender:$gender,price:$price,discount_rate:$discount_rate,category_type:$category_type,imagePath:$imagePath,brand:$brand) 
  { product_name category_type } }
`;
// // update product name and discount rate
// export const ADMIN_UPDATE_PRODUCT = gql `

// `;
// // delete product
// export const ADMIN_DELETE_PRODUCT = gql `

// `;
// // adds stock to existing size
// export const ADMIN_UPDATE_SIZESTOCK_PRODUCT = gql `

// `;
// // create new size and add stock to the new size
// export const ADMIN_ADD_PRODUCT_SIZE = gql `

// `;
