import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserLogin, setUserData } from "../util/userData";
import Header from '../component/Header';
import Footer from "../component/Footer";

const urlMain = "/gift-certificate-app";
const urlLogin = 'http://localhost:8080/gift-certificate-app/authentication/login';

function Login() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        errors.name = ``;
        errors.error = ``;

        if (!value) {
            errors[name] = `${name} cannot be empty`;
        }
        if (value.length <= 3) {
            errors[name] = `${name} must not be shorter than 3 characters`;
        }
        if (value.length >= 30) {
            errors[name] = `${name} must not be longer than 30 characters `;
        }

        setInputs(values => ({ ...values, [name]: value }));
        setErrors(errors => ({ ...errors }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs)
        };


        fetch(urlLogin, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type').includes('application/json');
                const data = isJson && await response.json();

                if (!response.ok) {
                    const error = (data?.errorMessage) || response.status;
                    return Promise.reject(error);
                }

                setUserData(data);
                navigate(urlMain);
            }
            )
            .catch(
                error => {
                    errors.error = error.toString();
                    setErrors(errors => ({ ...errors }));
                }
            );
    }


    useEffect(() => {
        if (getUserLogin() !== undefined) {
            navigate(urlMain);
        }
    })

    return (
        <>
            <Header />
            <form className="form-login" onSubmit={handleSubmit}>
                <h1 className="font-weight-normal" > Sign in </h1>

                <input type="text"
                    id="inputUsername"
                    className="form-control"
                    placeholder="Login"
                    name="login"
                    required minLength={3}
                    maxLength={30}
                    value={inputs.login || ""}
                    onChange={handleChange}
                />

                {<span className="form-error" style={{ color: "red" }}>{errors.login}</span>}

                <input type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    required minLength={4}
                    maxLength={30}
                    value={inputs.password || ""}
                    onChange={handleChange}
                />

                {<span className="form-error" style={{ color: "red" }} >{errors.password} </span>}
                {<span className="form-error" style={{ color: "red" }} > {errors.error}</span>}
                <input className="btn btn-lg btn-primary btn-block" type="submit" value="Login" />
            </form>
            <Footer />
        </>
    )
}

export default Login;