interface State {
    categories: Category;
}
const initialState: {items: Category[]} = {
    items: [],
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

interface ActionProps {
    type: string;
    data?: any;
}

export const categoryReducer = (state = initialState, action: ActionProps) => {
    switch (action.type) {
        case 'initialize_categories':
            return {
                ...state,
                items: action.data
            }
            
        default:
            return state
    }
}

export type categoryState = ReturnType<typeof categoryReducer>