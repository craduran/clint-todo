import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { getAuth, signOut } from "firebase/auth";
import { useSelector } from 'react-redux'
import { RootState } from '../app/reducer'
import { Navbar, Nav, NavDropdown, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { WriteToCloudFirestore } from '../components/cloudFirestore/Write';
import { ReadFromCloudData } from '../components/cloudFirestore/Read';
import { useRouter } from 'next/dist/client/router';
import store from '../app/store';
import { Categories } from '../components/main/categories'
import { Todos } from '../components/main/todos'
import { Category } from '../app/categoryReducer';
import { collection, getFirestore, getDocs, query, orderBy } from 'firebase/firestore';
import { Todo } from '../app/todosReducer'
import { AddTodo } from '../components/main/addTodo'
import { PageTemplate } from '../components/templates/pageTemplate';
import Link from 'next/link';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const Home: NextPage = ({ categories, todos }: any) => {
    const state = useSelector((state: RootState) => state);

    useEffect(() => {
        store.dispatch({ type: "initialize_categories", data: categories })
        store.dispatch({ type: "initialize_todos", data: todos })
    }, [])

    return (
        <PageTemplate renderComponent={
            <>
                <Row>
                    <Col>
                        <AddTodo />
                    </Col>
                    <Col>
                        <div className={`mt-5`}>
                            <Link href="/calendar" >Calendar</Link>
                        </div>
                    </Col>
                </Row>
                <Categories items={state.categories.items} />
                <Todos items={state.todos.items} />
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
export default Home