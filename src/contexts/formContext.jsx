import { createContext, useReducer } from 'react'

export const FormsContext = createContext()

export const formsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ITEM':
            return {
                ...state,
                [action.collection]: Array.isArray(action.payload) ? action.payload : [],
            };
        case 'CREATE_ITEM':
            return {
                ...state,
                [action.collection]: [action.payload, ...state[action.collection]]
            };
        case 'DELETE_ITEM':
            return {
                ...state,
                [action.collection]: state[action.collection].filter(item => item._id !== action.payload._id)
            };
        case 'GET_ITEM':
            return {
                ...state,
                [action.collection]: state[action.collection].map(item => (item._id === action.payload.id ? action.payload : item))
            };
        case 'UPDATE_ITEM':
            return {
                ...state,
                [action.collection]: state[action.collection].map(item =>
                    item._id === action.payload.id ? { ...item, ...action.payload.changes } : item
                ),
            };
        default:
            return state;
    }
};

export const FormsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(formsReducer, {
        forms: [],
        members: [],
        ISSForm: [],
        faculties: [],
        courses: [],
        charities: [],
        points: [],
        books: [],
        bookings: [],
        lecturers: [],
        galleries: [],
        lecturers: [],
        products: [],
        transactions: [],
        services: [],
        helpinghands: [],
    })



    return (
        <FormsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </FormsContext.Provider>
    )
}