import React from 'react'
import { Navbar, Container } from 'react-bootstrap';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

interface Props {
    renderComponent: JSX.Element;
    full?: boolean;
}
export const PageTemplate: React.FC<Props> = (props: Props) => {

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Todos</Navbar.Brand>
                </Container>
            </Navbar>
            <div className={props.full ? 'full-body': 'main-body'}>
                {props.renderComponent}
            </div>
        </>
    )
}