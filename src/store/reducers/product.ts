import {
  CHANGE_PRODUCT_CATEGORY,
  CHANGE_PRODUCT_CATEGORY_LOADING,
  CHANGE_PRODUCT_DETAIL,
  CHANGE_PRODUCT_LIST,
  CHANGE_PRODUCT_LOADING,
  REQUEST_PRODUCT_CATEGORY,
  REQUEST_HOMEPRODUCT,
  CHANGE_HOMEPRODUCT,
  CHANGE_HOMEPRODUCT_LOADING,
  REQUEST_SEARCHPRODUCT,
  CHANGE_SEARCHPRODUCT,
  CHANGE_SEARCHPRODUCT_LOADING,
} from "../../utils/constant";

const INITIAL_STATE = {
  loading: false,
  productCategoryList: [],
};

export function category(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_PRODUCT_CATEGORY:
      return { ...state, productCategoryList: action.data };
    case CHANGE_PRODUCT_CATEGORY_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}

const PRODUCT_INFO_INITIAL_STATE = {
  loading: false,
  productList: [],
  productDetail: {},
};

export function productInfo(state = PRODUCT_INFO_INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_PRODUCT_LIST:
      if (action.page != 1 && state.productList.products.length > 0) {
        console.log(state.productList.products);
        console.log(action.data.products);
        let result = [];
        state.productList.products.map((item) => {
          result.push(item);
        });
        if (action.data.products && action.data.products.length > 0) {
          action.data.products.map((item) => {
            result.push(item);
          });
        }
        return { ...state, productList: { products: result } };
      }
      return { ...state, productList: action.data };
    case CHANGE_PRODUCT_LOADING:
      return { ...state, loading: action.data };
    case CHANGE_PRODUCT_DETAIL:
      return { ...state, productDetail: action.data };
    default:
      return state;
  }
}
const HOME_PRODUCT_INITIAL_STATE = {
  loading: false,
  homeProduct: [],
};
export function homeProduct(state = HOME_PRODUCT_INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_HOMEPRODUCT:
      if (action.page != 1 && state.homeProduct.length > 0) {
        console.log(state.homeProduct);
        console.log(action.data.homeProduct);
        let result = [];
        state.homeProduct.map((item) => {
          result.push(item);
        });
        action.data.homeProduct.map((item) => {
          result.push(item);
        });
        return { ...state, homeProduct: result };
      }
      return { ...state, homeProduct: action.data };
    case CHANGE_HOMEPRODUCT_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
const SEARCH_PRODUCT_INITIAL_STATE = {
  loading: false,
  searchProduct: [],
};
export function searchProduct(state = SEARCH_PRODUCT_INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_SEARCHPRODUCT:
      if (action.page != 1 && state.searchProduct.length > 0) {
        console.log(state.searchProduct);
        console.log(action.data.searchProduct);
        let result = [];
        state.searchProduct.map((item) => {
          result.push(item);
        });
        if (action.data.searchProduct && action.data.searchProduct.length > 0) {
          action.data.searchProduct.map((item) => {
            result.push(item);
          });
        }
        return { ...state, searchProduct: result };
      }
      return { ...state, searchProduct: action.data };
    case CHANGE_SEARCHPRODUCT_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
