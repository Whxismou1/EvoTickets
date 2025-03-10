import { Button, Input, Form, DatePicker } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await register(username, email, password, dateOfBirth.toString());
      console.log(data);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <p>Register</p>
      <Form onSubmit={handleSubmit}>
        <Input
          name="username"
          label="Username"
          placeholder="Enter your username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <DatePicker
          name="dateOfBirth"
          label="Date of Birth"
          onChange={(date) => setDateOfBirth(date)}
        />

        <Button type="submit">Register</Button>
      </Form>
    </div>
  );
}

export default Register;
