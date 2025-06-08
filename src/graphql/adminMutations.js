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
      id
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
  mutation createProduct($product_name: String!,$gender:String!,$price:Float!,$discount_rate:Float!,$category_type:String!,$imagePath:String!,$brand:String!,$description:String!) 
  { createProduct(product_name:$product_name,gender:$gender,price:$price,discount_rate:$discount_rate,category_type:$category_type,imagePath:$imagePath,brand:$brand,description:$description) 
  { product_name category_type } }
`;

export const ADMIN_UPDATE_PRODUCT = gql `
  mutation updateProduct($product_id:String!,$product_name: String!,$gender: String!,$price:Float!,$discount_rate:Float!,$category_type: String!,$imagePath: String!,$brand: String!,$description: String!)
  { updateProduct(product_id:$product_id,product_name:$product_name,gender:$gender,price:$price,discount_rate:$discount_rate,category_type:$category_type,imagePath:$imagePath,brand:$brand,description:$description) 
  { product_name category_type } }
`

// delete product
export const ADMIN_DELETE_PRODUCT = gql `
  mutation deleteProduct($product_id: String!) { deleteProduct(product_id: $product_id)}
`;
// adds stock to existing size
export const ADMIN_UPDATE_SIZE_STOCK = gql`
  mutation updateProductSizeStock($product_id:String!,$size_type:String!,$stock_amount:Int!){ updateProductSizeStock(product_id:$product_id,size_type:$size_type,stock_amount:$stock_amount){ product_id size_type stock_amount } }
`;

// create new size and add stock to the new size
export const ADMIN_ADD_SIZE = gql`
  mutation AddProductSize($product_id:String!,$size_type:String!,$stock_amount:Int!){ AddProductSize(product_id:$product_id,size_type:$size_type,stock_amount:$stock_amount){ product_id size_type stock_amount } }
`;

export const ADMIN_VIEW_SIZES_BY_PRODUCT_ID = gql `
  query getProductsizes($product_id: String!) { getProductsizes(product_id: $product_id) { size_type stock_amount } }
`;
export const GET_ALL_ORDERS = gql `
  query { getAllorders { customer_id product_id size_type quantity total_price location } }
`