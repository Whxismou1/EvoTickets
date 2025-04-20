import { DateInput } from "@heroui/date-input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
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
    //if los campos !validos le paso el username ... pues hago un alert o un return
    try {
      await register(username, email, password, dateOfBirth.toString());
      navigate("/verifyAccount", { state: { email } });
    } catch (error) {
      alert(error.message);
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
