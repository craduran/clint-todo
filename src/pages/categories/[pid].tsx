import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Category } from '../../app/categoryReducer'
import { Todo } from '../../app/todosReducer'
import { PageTemplate } from '../../components/templates/pageTemplate'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux'
import { RootState } from '../../app/reducer'
import store from '../../app/store'
import { Categories } from '../../components/main/categories'
import { AddTodo } from '../../components/main/addTodo'
import { Todos } from '../../components/main/todos'
import Link from 'next/link';

const CategoriesPage: NextPage = ({ categories, todos }: any) => {
    const state = useSelector((state: RootState) => state);
    const router = useRouter()
    const { pid } = router.query

    useEffect(() => {
        store.dispatch({ type: "initialize_categories", data: categories })
        store.dispatch({ type: "initialize_todos", data: todos })
    }, [])

    const filterTodos = () => {
        return state.todos.items.filter((todo: Todo) => todo.categoryId === pid);
    }

    const filterCategories = () => {
        return state.categories.items.filter((category: Category) => category.id === pid);
    }

    return (
        <PageTemplate renderComponent={
            <>
                <Link href={`/`}>Back</Link>
                <Categories items={filterCategories()} />
                <Todos items={filterTodos()} />
            </>
        } />
    )
}

export async function getServerSideProps(context: any) {
    const { pid } = context.query;
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

export default CategoriesPage