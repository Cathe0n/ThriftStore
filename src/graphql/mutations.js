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

export const ADD_TO_WISHLIST = gql`
  mutation addToWishList($product_id: String!) {
    addToWishList(product_id: $product_id) {
      product_name
    }
  }
`;

export const GET_WISHLIST_BY_CUSTOMER_ID = gql`
  query GetWishListByCustomerId {
    getWishListByCustomerId {
      id
      product_id
      product_name
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation removeFromwishList($wishlist_id: String!) {
    removeFromwishList(wishlist_id: $wishlist_id)
  }
`;

export const ADD_PRODUCT_TO_CART = gql`
  mutation addProducttoShoppingcart($product_id: String!, $quantity: Int!, $size_type: String!) {
    addProducttoShoppingcart(product_id: $product_id, quantity: $quantity, size_type: $size_type) {
      product_id
      quantity
      total_price
    }
  }
`;

export const GET_SHOPPINGCART_BY_CUSTOMER_ID = gql`
  query {
    getShoppingcartBycustomerId {
      id
      product_id
      product_name
      quantity
      total_price
      size_type   
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation removeProductfromCart($ShoppingCartID: String!) {
    removeProductfromCart(ShoppingCartID: $ShoppingCartID)
  }
`;

export const CREATE_ORDER = gql`
  mutation createOrder($product_id: String!, $quantity: Int!, $size_type: String!, $location:String!) {
    createOrder(product_id: $product_id, quantity: $quantity, size_type: $size_type, location: $location) {
      product_id
      quantity
      total_price
    }
  }
`;

export const GET_ORDER_BY_CUSTOMER_ID = gql`
  query {
    getOrderByCustomerId { customer_id product_id size_type quantity total_price
      product_id
      quantity
      location
      total_price
      size_type   
    }
  }
`;

export const GET_TRENDING_PRODUCTS = gql`
  query GetTrendingProducts {
    getTrendingProducts {
      id
      product_name
      brand
      price
      imagePath
    }
  }
`;

export const GET_DISCOUNTED_PRODUCTS = gql`
  query {
    getDiscountedProducts {
      id
      product_name
      price
      discount_rate
      imagePath
    }
  }
`;

export const GET_LOW_STOCK_PRODUCTS = gql`
  query GetLowStockProducts {
    getLimitedStockProducts {
      id
      product_name
      price
      imagePath
      Total_stock
    }
  }
`;