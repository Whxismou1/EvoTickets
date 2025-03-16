import { Button } from "@heroui/react";
import { useAuthStore } from "../store/authStore";

function Home() {
  const { logout } = useAuthStore();

  const handleLogOut = () => {
    logout();
  };

  return (
    <div>
      Welcome Home
      <Button onPress={handleLogOut}>Log Out</Button>
    </div>
  );
}

export default Home;
