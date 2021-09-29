import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, FloatingLabel, Form, FormControl, InputGroup, Modal, ModalProps, Row, ToggleButton } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Category } from '../../app/categoryReducer';
import { RootState } from '../../app/reducer';
import store from '../../app/store';
import { Todo } from '../../app/todosReducer';
import DatePicker from "react-datepicker";
import { collection, Firestore, getFirestore, addDoc, getDocs, getDoc, updateDoc, doc, serverTimestamp, DocumentReference, DocumentData } from 'firebase/firestore';

function MyVerticallyCenteredModal(props: ModalProps) {
    const categories = useSelector((state: RootState) => state.categories.items);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [error, setError] = useState<string>("");

    const todoName = useRef<HTMLInputElement>(null);
    const todoCategory = useRef<HTMLSelectElement>(null);
    const db = getFirestore();


    const createTodo = async (name: string | undefined, categoryId: string | undefined) => {

        const docRef = await addDoc(collection(db, "todos"), {
            Action: name,
            CategoryId: categoryId,
            CreatedDate: serverTimestamp(),
            IsDone: false,
            Deadline: startDate
        });
        return docRef.id;
    }

    const saveTodo = () => {
        let action = todoName.current?.value;
        let categoryId = todoCategory.current?.value;

        if (todoName.current?.value === "") {
            setError("Please enter a valid todo description");
        } else {
            setError("");
            createTodo(action, categoryId).then((id: string) => {
                console.log({
                    id: id,
                    action: action,
                    categoryId: categoryId,
                    createdDate: "now",
                    isDone: false,
                    deadline: startDate
                })
                store.dispatch({
                    type: "add_todo",
                    data: {
                        id: id,
                        action: action,
                        categoryId: categoryId,
                        createdDate: "now",
                        isDone: false,
                        deadline: startDate
                    }
                })

                props.onHide();
            }).catch((err) => {
                console.log(err)
                setError("Something went wrong");
            })
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Todo
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    <Container>
                        <Row>
                            <Col>
                                <div>{error}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Todo Description</Form.Label>
                                    <Form.Control type="text" placeholder="Todo description" ref={todoName} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md>
                                <FloatingLabel controlId="floatingSelectGrid" label="Select Category">
                                    <Form.Select aria-label="Floating label select example" ref={todoCategory} >
                                        {categories.map((i: Category, index: number) => {
                                            return (
                                                <option value={i.id} key={index}>{i.name}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={'mt-3'}>
                                <Form.Label>Deadline</Form.Label>
                                <DatePicker selected={startDate} onChange={(date: any) => setStartDate(date)} />
                            </Col>
                        </Row>
                        <Row className="justify-content-md-end mt-3">
                            <Col md="auto">
                                <Button onClick={saveTodo}>Save</Button>
                            </Col>
                        </Row>
                    </Container>
                </>
            </Modal.Body>
        </Modal>
    );
}


export const AddTodo = () => {
    const [modalShow, setModalShow] = useState(false);
    return (
        <div className="mt-5">
            <Button variant="primary" onClick={() => setModalShow(true)}>
                Add Todo
            </Button>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    )
}