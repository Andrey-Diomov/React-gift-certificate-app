import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Form, message } from "antd";
import Input from "antd/es/input/Input";
import { WithContext as ReactTags } from 'react-tag-input';
import { addOrEditCert } from '../../util/certificateHttpQuery';
import { useSearchParams } from "react-router-dom";

const nameMinLength = 6;
const nameMaxLength = 30;
const descMinLength = 12;
const descMaxLength = 1000;
const tagMinLength = 3;
const tagMaxLength = 15;

const KeyCodes = {
    comma: 188,
    enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export const AddOrEditCertificateModel = (props) => {

    const errorTagLengthMin = 'length must be between min: ';
    const errorLengthMin = 'must be fill, and length between min: ';
    const errorLengthMax = ', max: ';
    const errorZero = 'must be great then 0';

    const [show, setShow] = useState(false);
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const onFinish = () => {
        //console.log(isNaN(inputs.price))
        const errors = {};
        if (inputs.name === '' || inputs.name.length < nameMinLength || inputs.name.length > nameMaxLength) {
            errors.name = errorLengthMin + nameMinLength + errorLengthMax + nameMaxLength;
        }
        if (inputs.description === '' || inputs.description.length < descMinLength || inputs.description.length > descMaxLength) {
            errors.description = errorLengthMin + descMinLength + errorLengthMax + descMaxLength;
        }
        if (inputs.price === '' || isNaN(inputs.price) || parseFloat(inputs.price.toString().replace(",", ".")) <= 0) {
            errors.price = errorZero;
        }
        if (inputs.duration === '' || isNaN(inputs.duration) || parseInt(inputs.duration, 10) < 0) {
            errors.duration = errorZero;
        }
        if (tags) {
            inputs.tags = tags.map(tag => {
                if (tag.name.length < tagMinLength || tag.name.length > tagMaxLength) {
                    errors.tag = errorTagLengthMin + nameMinLength + errorLengthMax + nameMaxLength;
                }
                return { name: tag.name }
            });
        }

        if (Object.keys(errors).length > 0) {
            Object.keys(errors).map((key) => message.error(key + ": " + errors[key], 5));
            return;
        }

        inputs.action = '';
        addOrEditCert(inputs.id > 0 ? inputs.id : undefined, inputs).then(data => {
            if (data && data.errorMessage) {
                message.error({ content: data.errorMessage }, 5);
                return;
            }
            setSearchParams(new URLSearchParams({ sort: 'DESC' }))
            window.location.reload();
            message.success({ content: 'OK: ' + data.message }, 5);
        });
    }
    // Tags
    let suggestions = [];
    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };
    const handleAddition = tag => {
        setTags([...tags, tag]);
    };
    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        // re-render
        setTags(newTags);
    };
    const handleTagClick = index => {
        console.log('The tag at index ' + index + ' was clicked');
    };

    // EndTags

    /*
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 10 },
    };
    */

    React.useEffect(() => {
        if (props?.certificate) {
            setInputs(props.certificate);
            const id = props.certificate.key ? props.certificate.key : 0;
            setInputs(values => ({ ...values, ['id']: id }))
            suggestions = props.certificate.tags.map(tag => {
                return {
                    id: tag.id.toString(),
                    name: tag.name
                };
            });
            setTags(suggestions);
        }
    }, [props])

    return (
        <>
            {
                (props?.certificate?.key) ?
                    <Button variant="warning" onClick={handleShow} > Edit </Button> :
                    <Button variant="outline-success" size="sm" onClick={handleShow} > Add new </Button>
            }

            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {
                            (props?.certificate?.key) ? 'Certificate edit id=' + props.certificate.key : 'Certificate add'
                        }
                    </Modal.Title>
                </Modal.Header> <Modal.Body>
                    <Form  onFinish={onFinish} >                        
                        <Form.Item name='Name'
                            label='Name'
                            initialValue={(props?.certificate?.name) || inputs.name}
                            rules={[{ required: true, min: nameMinLength, max: nameMaxLength }]} >
                            <Input name="name" placeholder="Name" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item name='Description'
                            label='Description'
                            initialValue={(props?.certificate?.description) || inputs.description}
                            rules={[{ required: true, min: descMinLength, max: descMaxLength }]}>
                            <Input.TextArea showCount maxLength={descMaxLength}
                                name="description"
                                placeholder="Description"
                                onChange={handleChange} />
                        </Form.Item>
                        <Form.Item name='Price'
                            label='Price'
                            initialValue={(props?.certificate?.price) || inputs.price}
                            rules={[{ required: true }]}>
                            <Input name="price" placeholder="Price" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item name='Duration'
                            label='Duration'
                            initialValue={(props?.certificate?.duration) || inputs.duration}
                            rules={[{ required: true }]} >
                            <Input name="duration" placeholder="Duration" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item name='Tags'
                            label='Tags'
                            rules={[{ min: tagMinLength, max: tagMaxLength }]} >
                            <ReactTags name="Tags"
                                maxLength={tagMaxLength}
                                minQueryLength={tagMinLength}
                                tags={tags}
                                labelField='name'
                                placeholder='Tag'
                                suggestions={suggestions}
                                delimiters={delimiters}
                                handleDelete={handleDelete}
                                handleAddition={handleAddition}
                                handleDrag={handleDrag}
                                handleTagClick={handleTagClick}
                                inputFieldPosition="top"
                                allowDeleteFromEmptyInput={false}
                                autocomplete
                            />
                        </Form.Item>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {
                        handleClose();
                        onFinish()
                    }
                    }
                        type="submit" > Save </Button>
                    <Button variant="secondary" onClick={handleClose} > Cancel </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

