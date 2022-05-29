import { Button, FormControl, Nav, Navbar, Container } from "react-bootstrap";
import { Form } from "antd";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isRoleAdmin, getUserLogin, removeUserData } from "../util/userData";
import { AddOrEditCertificateModel } from "./model/AddOrEditCertificateModel";


const mainURL = "/gift-certificate-app";
const loginURL = '/gift-certificate-app/login';

const certName = 'name';
const tagName = 'tagName';

function Header(props) {
    let headerName = isRoleAdmin() ? "Admin UI" : "UI";
    let buttonLogin = 'Login';
    let buttonMain = 'Main';
    let userLogin = '';

    const [inputs, setInputs] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    let loadSearchParam = new URLSearchParams(window.location.search);
    let tagsUrl = loadSearchParam.get(tagName) ? loadSearchParam.get(tagName).trim().split(',').map(value => '#(' + value + ')') : '';
    let searchValue = (loadSearchParam && loadSearchParam.get(certName) ? loadSearchParam.get(certName) : '') + " " + tagsUrl;
    searchValue = searchValue.replace(',', " ");
    const [search, setSearch] = useState({ searchValue });

    if (getUserLogin() !== undefined) {
        userLogin = 'Login: ' + getUserLogin();
        buttonLogin = 'Logout';
    }

    const switchTo = (url) => {
        if (buttonLogin === 'Logout') {
            removeUserData();
        }
        navigate(url);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
        setSearch({ searchValue: '' });
    }

    const handleSubmit = (event) => {
        let check = {};
        const tags = [];
        const searchData = {};
        const searchLine = search.searchValue !== '' ? search.searchValue.trim() : inputs.search;

        if (searchLine) {
            searchLine.split('#').map(element => {
                element = element.trim();
                check = element.match('^\\((\\w|\\d| )+\\)');
                check
                    ? tags.push(check[0].match('(\\w|\\d| )+')[0])
                    : (searchData.certName = element) && (searchData.certDesc = element);
            })
            searchData.tagName = tags;
            setSearchParams(new URLSearchParams(searchData));
            /*navigate(window.location.pathname + "?" + new URLSearchParams(searchData));*/
            window.location.reload();
        } else {
            setSearchParams({});
            window.location.reload();
        }
    }

    return (
        <>
            <Navbar bg="dark" expand="lg" variant="dark" >
                <Container fluid>
                    <Navbar.Brand>{headerName}</Navbar.Brand>
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll>
                        <Nav.Link>{isRoleAdmin() ? <a> <AddOrEditCertificateModel/></a> : ''}</Nav.Link>
                    </Nav>

                    {!window.location.pathname.includes('login') ?
                        <Form className="d-flex" style={{ width: '25%' }} onSubmit={handleSubmit}>
                            <FormControl onChange={handleChange}
                                type="text"
                                placeholder="Search"
                                className="mr-sm-1 header-btn"
                                aria-label="Search"
                                name="search"
                                value = { inputs.search || (search.searchValue === ' ' ? undefined : search.searchValue)}
                            />
                            <Button   onClick = { handleSubmit } variant="outline-success">Search</Button>
                        </Form>
                        : ''
                    }

                    <div className='header-btn'
                        style={{ width: '30%', color: 'white', textAlign: 'right' }}>{userLogin}</div>

                    {!window.location.pathname.includes('login') ?
                        <Button variant="outline-secondary" onClick={() => switchTo(loginURL)}>{buttonLogin}</Button>
                        : <Button variant="outline-secondary" onClick={() => switchTo(mainURL)}>{buttonMain}</Button>}

                </Container>
            </Navbar>
        </>
    );
}
export default Header;
