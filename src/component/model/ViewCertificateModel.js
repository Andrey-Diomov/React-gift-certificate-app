import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export const ViewCertificateModel = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} > View </Button>

            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton >
                    <Modal.Title > Certificate id = {props.certificate.key} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> Created Date: {props.certificate.createdDate} </p>
                    <p> Name: {props.certificate.name} </p>
                    <p> Description: {props.certificate.description} </p>
                    <p> Price: {props.certificate.price} </p>
                    <p> Tags: {props.certificate.tags.map(tag => <p> {tag.name} </p>)}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} > Close </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}