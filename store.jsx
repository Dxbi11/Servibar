import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from './src/config/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

/**
 * Global application interface (ui) state
 * @typedef {Object} UI
 * @property {Array} products - Array of all the products in the store
 */
const ui = {
  products: [],
  hotels: [],
  floors: [],
  rooms: [],
  invoices: [],
  storeHouse: [],	
  hotelId: null,
  roomStock: [],
  userUUID: null, // Add this line
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
      case 'REMOVE_PRODUCT':
        const updatedProducts = state.ui.products.filter(
          (product) => product.id !== action.payload.productId
        );
        return {
          ...state,
          ui: {
            ...state.ui,
            products: updatedProducts,
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
      case 'SET_HOTELS':
        return {
          ...state,
          ui: {
            ...state.ui,
            hotels: action.payload,
          },
        };
      case 'SET_ROOM_STOCK':
        return {
          ...state,
          ui: {
            ...state.ui,
            roomStock: action.payload,
          },
        };
      case 'ADD_ROOM_STOCK':
        return {
          ...state,
          ui: {
            ...state.ui,
            roomStock: [...state.ui.roomStock, action.payload],
          },
        };
      case 'SET_ROOMS':
        return {
          ...state,
          ui: {
            ...state.ui,
            rooms: action.payload,
          },
        };
      case 'SET_FLOORS':
        return {
          ...state,
          ui: {
            ...state.ui,
            floors: action.payload,
          },
        };
        case 'UPDATE_ROOM':
          return {
              ...state,
              ui: {
                  ...state.ui,
                  rooms: state.ui.rooms.map(room =>
                      room.id === action.payload.id ? action.payload : room
                  ),
              },
          };
        case 'UPDATE_INVOICE':
          return {
              ...state,
              ui: {
                  ...state.ui,
                  invoices: state.ui.invoices.map(invoice =>
                      invoice.id === action.payload.id ? action.payload : invoice
                  ),
              },
          };
        case 'SET_INVOICES':
          return {
              ...state,
              ui: {
                  ...state.ui,
                  invoices: action.payload,
              },
          };
        case 'DELETE_ROOM_STOCK':
          return {
              ...state,
              ui: {
                  ...state.ui,
                  roomStock: state.ui.roomStock.filter(roomStock => roomStock.id !== action.payload.id),
              },
          };
        case 'SET_STORE_HOUSE':
          return {
              ...state,
              ui: {
                  ...state.ui,
                  storeHouse: action.payload,
              },
          };
        case 'UPDATE_STORE_HOUSE':
          return {
              ...state,
              ui: {
                  ...state.ui,
                  storeHouse: state.ui.storeHouse.map(storeHouse =>
                      storeHouse.id === action.payload.id ? action.payload : storeHouse
                  ),
              },
          };
    case 'SET_USER_UUID':
      return {
        ...state,
        ui: {
          ...state.ui,
          userUUID: action.payload,
        },
      };
    case 'ADD_FLOOR':
      return {
        ...state,
        ui: {
          ...state.ui,
          floors: [...state.ui.floors, action.payload],
        },
      };
    default:
      return state; // Changed from throwing an error to returning the current state
  }
};

function StateProvider({ children }) {
  const [state, dispatch] = useReducer(stateReducer, ApplicationState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'SET_USER_UUID', payload: user.uid });
      } else {
        dispatch({ type: 'SET_USER_UUID', payload: null });
      }
    });

    return () => unsubscribe();
  }, []);

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
