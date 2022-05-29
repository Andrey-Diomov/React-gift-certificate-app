import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export const DeleteCertificateModel = (props) => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="danger" onClick={handleShow} > Delete </Button>

            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton >
                    <Modal.Title > Delete confirmation </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    Do you really want to delete certificate with id = {props.certificate.key} ?
                </Modal.Body>
                <Modal.Footer >
                    <Button variant="danger"
                        onClick={() => {
                            props.onClick();
                            handleClose()
                        }
                        }
                        type="submit" > Yes </Button>
                    <Button variant="secondary" onClick={handleClose} > Cancel </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}