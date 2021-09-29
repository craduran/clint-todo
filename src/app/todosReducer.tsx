import update from 'immutability-helper';

const initialState: { currentUser: null | string, items: Todo[] } = {
    currentUser: null,
    items: [],
}

export interface Todo {
    id: string;
    action: string;
    categoryId: string;
    createdDate: string;
    isDone: boolean;
    deadline: string;
}

interface ActionProps {
    type: string;
    data?: any;
}

export const todosReducer = (state = initialState, action: ActionProps) => {
    switch (action.type) {
        case 'done_todo':
            const DoneFindFilterValue = state.items.findIndex(((todo: Todo) => todo.id === action.data));
            if (typeof DoneFindFilterValue !== "undefined") {
                let updateValues: Todo = update(state.items[DoneFindFilterValue], { isDone: { $set: true } });
                let newData = update(state.items, {
                    $splice: [[DoneFindFilterValue, 1, updateValues]]
                })
                console.log(newData)
                return {
                    ...state,
                    items: newData
                }
            }
            else {
                return state;
            }
        case 'undo_todo':
            const UndoFindFilterValue = state.items.findIndex(((todo: Todo) => todo.id === action.data));
            if (typeof UndoFindFilterValue !== "undefined") {
                let updateValues: Todo = update(state.items[UndoFindFilterValue], { isDone: { $set: false } });
                let newData = update(state.items, {
                    $splice: [[UndoFindFilterValue, 1, updateValues]]
                })
                return {
                    ...state,
                    items: newData
                }
            }
            else {
                return state;
            }
        case 'remove_todo':
            return {
                ...state,
                items: state.items.filter((item: Todo) => item.id !== action.data),
            }
        case 'sign_in_user':
            return {
                ...state,
                currentUser: action.data
            }
        case 'sign_out_user':
            return {
                ...state,
                currentUser: null
            }
        case 'initialize_todos':
            return {
                ...state,
                items: action.data
            }
        case 'add_todo':
            console.log([action.data, ...state.items])
            return {
                ...state,
                items: [action.data, ...state.items]
            }
        default:
            return state
    }
}

export type TodosState = ReturnType<typeof todosReducer>