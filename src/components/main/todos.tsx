import React, { useEffect, useState } from 'react';
import { Form, FormControl, InputGroup, ToggleButton } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Category } from '../../app/categoryReducer';
import { RootState } from '../../app/reducer';
import store from '../../app/store';
import { Todo } from '../../app/todosReducer';
import { collection, Firestore, getFirestore, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

interface Props {
    items: Todo[];
}

export const Todos = (props: Props) => {
    return (
        <ul className={"todos"}>
            {props.items.map((i: Todo, index: number) => {
                return (
                    <TodoItem key={index} item={i} />
                )
            })}
        </ul>
    )
}

export const getName = (categoryId: string, categories: Category[]) => {
    let getCategory = categories.find((item: Category) => item.id === categoryId);
    if (getCategory) {
        return getCategory.name.toLowerCase();
    } else {
        return "";
    }
}

interface TodoItemProps {
    item: Todo;
}

const TodoItem = (props: TodoItemProps) => {

    const categories = useSelector((state: RootState) => state.categories)
    const db = getFirestore();

    const editTodo = async (id: string, isChecked: boolean) => {
        const todos = doc(db, "todos", id);
        await updateDoc(todos, {
            IsDone: !isChecked
        });

        return todos.id
    }

    const updateTodo = (id: string, isChecked: boolean) => {
        console.log(isChecked)
        if(isChecked) {
            console.log(`undo dispatching ${id}`)
            store.dispatch({type: "undo_todo", data: id});
        } else {
            console.log(`done_todo dispatching ${id}`)
            store.dispatch({type: "done_todo", data: id});
        }

        editTodo(id, isChecked)
            .then((res) => {
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const deleteTodoFirestore = async (id: string) => {
        const res = await deleteDoc(doc(db, "todos", id));

        return res;
    }

    const deleteTodo = (id: string) => {
        console.log("delete " + id)
        store.dispatch({ type: "remove_todo", data: id })
        deleteTodoFirestore(id)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.log(err));
    }

    const getColor = (categoryId: string) => {
        let getCategory: Category = categories.items.find((item: Category) => item.id === categoryId);
        if (getCategory) {
            return getCategory.color;
        } else {
            return "#000000";
        }
    }

    useEffect(() => {
    }, [])

    return (
        <li>
            <div className="d-flex action" style={{ color: getColor(props.item.categoryId) }}>
                <Form.Check
                    type="checkbox"
                    className={getName(props.item.categoryId, categories.items)}
                    label={<div style={{ textDecoration: props.item.isDone ? 'line-through' : 'none' }}>{props.item.action}</div>}
                    onChange={() => {
                        console.log("onchange")
                        updateTodo(props.item.id, props.item.isDone);
                    }} checked={props.item.isDone}
                    style={{
                        flexGrow: 1,
                    }}
                />
                <button className={"button-link"} onClick={() => deleteTodo(props.item.id)}>
                    Delete
                </button>
            </div>
        </li>
    )
}
