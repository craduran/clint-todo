import { collection, Firestore, getFirestore, addDoc, getDocs } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Category } from '../../app/categoryReducer';
import { RootState } from '../../app/reducer';
import store from '../../app/store';
import Link from 'next/link';
import { Todo } from '../../app/todosReducer';
import { ProgressBar } from 'react-bootstrap';

interface Props {
    items: Category[];
}

export const Categories = (props: Props) => {
    return (
        <ul className={`categories`}>
            {props.items.map((i: Category) => {
                return (
                    <CategoryPanel item={i} key={i.id}/>
                )
            })}
        </ul>
    )
}

interface CategoryPanelProps {
    item: Category;
}

const CategoryPanel = (props: CategoryPanelProps) => {
    const todos: Todo[] = useSelector((state: RootState) => state.todos.items.filter((todo: Todo) => todo.categoryId === props.item.id));
    const state = useSelector((state: RootState) => state);
    const getDonePercentage = () => {
        let todosDone: Todo[] = todos.filter((t: Todo) => t.isDone);
        if(!todosDone) {
            todosDone = [];
        }

        let percentage = Math.floor((todosDone.length / todos.length)*100);

        return isNaN(percentage) ? 0 : percentage;
    }

    return (
        <li key={props.item.id} className={`p-3`}>
            <Link href={`/categories/${props.item.id}`}>
                {props.item.name}
            </Link>
            <ProgressBar now={getDonePercentage()} label={`${getDonePercentage()}%`} className={props.item.name.toLowerCase()}/>
        </li>
    )
}