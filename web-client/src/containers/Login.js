import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        axios.get('http://localhost:8080/api/users')
            .then(response => {
                const users = response.data.data;
                const foundUser = users.find(user => user.username === username && user.password === password);
                console.log(foundUser);
                if (foundUser) {
                    const isAdmin = foundUser.hasOwnProperty("isAdmin") && foundUser["isAdmin"] === 1;
                    console.log(isAdmin);
                    if (isAdmin) {
                        console.log("foundAdmin");
                        navigate("/Admin");
                    }
                    else {
                        console.log("foundUser");
                        console.log('state', { state: { username } });
                        navigate(`/User`, { state: { username } });
                    }
                } else {
                    console.log("notFound");
                    alert("Invalid username or password. Please try again.");
                }
                setIsLoading(false);
            }).catch(err => {
                console.error(err);
                alert("Can't connect to server!");
                setIsLoading(false);
            });
    }

    return (
        <div className="Login">
            <h1>Net Cafe</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="my-input"
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="mt-4 d-grid gap-2">
                    <Button size="lg" type="submit" disabled={!validateForm() || isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
