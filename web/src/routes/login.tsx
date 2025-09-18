import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log("sdsd");
    window.location.href = "http://localhost:8080/api/v1/auth/login/google";
  };
  return (
    <div>
      <h1>login form</h1>
      <form onSubmit={onSubmit}>
        <Button>login with gmail</Button>
      </form>
    </div>
  );
}
