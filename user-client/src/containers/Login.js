import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import axios from "axios"

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        axios.get('http://localhost:8080/api/users')
            .then(response => {
                const users = response.data;
                const foundUser = users.data.find(user => user.username === username && user.password === password);
                console.log(foundUser);
                if (foundUser) {
                    const isAdmin = foundUser.hasOwnProperty("isAdmin") && foundUser["isAdmin"] === 1;
                    console.log(isAdmin);
                    if (isAdmin) {
                        console.log("foundAdmin");
                    }
                    else {
                        console.log("foundUser");
                    }
                } else {
                    console.log("notFound");
                    alert("Incorrect username or password. Please try again.");
                }
            })
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <Button variant="dark" size="lg" type="submit" disabled={!validateForm()}>
                        Login
                    </Button>
                </div>
            </Form>
        </div>
    );
}