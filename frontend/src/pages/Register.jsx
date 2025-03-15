import { Button, Input, Form, DateInput } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      const data = await register(
        username,
        email,
        password,
        dateOfBirth.toString()
      );

      if (!data) {
        alert("Register failed");
        return;
      }

      console.log(data);

      navigate("/verifyAccount", { state: { email } });
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
        <DateInput
          name="dateOfBirth"
          className="max-w-sm"
          label={"Birth date"}
          onChange={(date) => setDateOfBirth(date)}
          placeholderValue={new CalendarDate(1995, 11, 6)}
        />
        <Button type="submit">Register</Button>
      </Form>
      <p className="text-center text-small">
        <Link to="/login">LogIn</Link>
      </p>
    </div>
  );
}

export default Register;
