import React, { useEffect } from 'react'

import { NextPage } from 'next';
import { Calendar } from 'antd';
import { PageTemplate } from '../components/templates/pageTemplate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, getFirestore, getDocs, query, orderBy } from 'firebase/firestore';
import { Todo } from '../app/todosReducer';
import { Category } from '../app/categoryReducer';
import moment from 'moment';
import Link from 'next/link';
import store from '../app/store';
import { useSelector } from 'react-redux';
import { RootState } from '../app/reducer';

const CalendarPage: NextPage = ({ categories, todos }: any) => {
    const state = useSelector((state: RootState) => state);
    let d = new Date();
    let n = d.getMonth();
    let [currentMonth, setCurrentMonth] = React.useState<string>((n + 1).toString());

    const getColor = (categoryId: string) => {
        let category: Category = state.categories.items.find((c: Category) => c.id === categoryId);
        if(category) {
            return category.color;
        } else {
            return "#000";
        }
    }

    const onPanelChange = (value: any, mode: any) => {
        setCurrentMonth(value.format('M'));
    }


    const dateCellRender = (value: any) => {
        const listData: Todo[] = [];
        
        state.todos.items.map((todo: Todo) => {
            if(moment(todo.deadline).format('YYYY-MM-DD') === value.format('YYYY-MM-DD')) {
                listData.push(todo);
            }
        })
        return (
            <ul className="events" style={{listStyle: "none", padding: "0px"}}>
                {
                    listData.map((item, index: number) => (
                        <li key={index} style={{fontSize: "0.8rem"}}>
                            <span className={`event-${item.categoryId}`} style={{paddingRight: "5px", color: getColor(item.categoryId) }}>●</span>
                            <span style={{textDecoration: item.isDone ? "line-through": "none"}}>{item.action}</span>
                        </li>
                    ))
                }
            </ul>
        );
    }

    const getMonthData = (value: any) => {
        if (value.month() === 8) {
            return 1394;
        }
    }
    useEffect(() => {
        store.dispatch({ type: "initialize_categories", data: categories })
        store.dispatch({ type: "initialize_todos", data: todos })
    }, [])
    return (
        <PageTemplate full={true} renderComponent={
            <>
                <Link href="/">Back</Link>
                <Calendar dateCellRender={dateCellRender} onPanelChange={onPanelChange} />
            </>
        } />
    )
}
export async function getServerSideProps() {
    const db = getFirestore();

    const categoriesQuery = await getDocs(collection(db, "categories"));

    let categories: Category[] = [];
    categoriesQuery.forEach((doc) => {
        let data = doc.data();
        categories.push({
            id: doc.id,
            name: data.Name,
            color: data.Color
        })
    });

    const todosQuery = await getDocs(collection(db, "todos"));
    const q = query(collection(db, "todos"), orderBy("CreatedDate", "desc"))
    const sortedTodos = await getDocs(q);
    let todos: Todo[] = [];
    sortedTodos.forEach((doc) => {
        let data = doc.data();
        todos.push({
            id: doc.id,
            action: data.Action,
            categoryId: data.CategoryId,
            createdDate: data.CreatedDate.toDate().toDateString(),
            isDone: data.IsDone,
            deadline: data.Deadline ? data.Deadline.toDate().toDateString() : ''
        })
    });

    return { props: { categories, todos } };
}
export default CalendarPage;