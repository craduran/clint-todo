import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useSelector } from 'react-redux'
import store from './../app/store';
import { RootState } from '../app/reducer'
import { Navbar, Nav, NavDropdown, Container, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, query, where, getFirestore, getDocs } from "firebase/firestore";
import firebase from "../firebase/initFirebase";
import { WriteToCloudFirestore } from '../components/cloudFirestore/Write'
import { ReadFromCloudData } from '../components/cloudFirestore/Read';
import { useRouter } from 'next/dist/client/router'

const Login: NextPage = () => {
    const auth = getAuth();
    const router = useRouter();
    const signIn = () => {
        signInWithEmailAndPassword(auth, "clintrduran@gmail.com", "abc123")
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user.email)
                store.dispatch({ type: 'sign_in_user', data: user.email })
                router.push('/');
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                console.log(error)
            });
    }
    useEffect(() => {
        console.log(auth.currentUser);
        if(auth.currentUser) {
            console.log("hello?")
            router.push('/');
        }
    }, [])
    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            signIn();
            }}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default Login;