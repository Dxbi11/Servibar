import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

/**
 * Global application interface (ui) state
 * @typedef {Object} UI
 * @property {Array} products - Array of all the products in the store
 */
const ui = {
  products: [],
  hotelId: null,
};

/**
 * The application global state
 * @typedef {Object} ApplicationState
 * @property {UI} ui - The global application interface state
 */
const ApplicationState = {
  ui,
};

const store = createContext(ApplicationState);
const { Provider } = store;

/**
 * stateReducer - mutates parts of the state according to the action type
 * @param {ApplicationState} state - The current application state
 * @param {Object} action - The action that mutates the state
 */
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        ui: {
          ...state.ui,
          products: action.payload,
        },
      };
      case 'SET_HOTEL_ID':
        return {
          ...state,
          ui: {
            ...state.ui,
            hotelId: action.payload,
          },
        };
    default:
      // Throw an error for any unsupported action types
      throw new Error();
  }
};

function StateProvider({ children }) {
  const [state, dispatch] = useReducer(stateReducer, ApplicationState);

  return (
    <Provider value={{ state, dispatch }}>
      {children}
    </Provider>
  );
}

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export { store, StateProvider };
