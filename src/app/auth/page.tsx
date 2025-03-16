import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import PhoneAuth from "@/components/PhoneAuth";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Home</h1>
      <PhoneAuth />
      <div className="flex gap-4">
        <LoginButton />
        <LogoutButton />
      </div>
    </div>
  );
}
