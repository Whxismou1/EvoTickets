import { Form, InputOtp, Button } from "@heroui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { verifyAccount } from "../services/authService";
import { useNavigate } from "react-router-dom";

function VerifyAccount() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;

  return (
    <Form
      className="flex w-full flex-col items-start gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const otp = formData.get("otp");
        setOtp(otp);
        await verifyAccount(otp, email);
        navigate("/login");
      }}
    >
      <InputOtp
        isRequired
        aria-label="OTP input field"
        length={6}
        name="otp"
        errorMessage="Invalid OTP code"
      />
      <Button size="sm" type="submit" variant="bordered">
        Submit
      </Button>
    </Form>
  );
}

export default VerifyAccount;
