"use client";
import AuthForm from "app/components/ui/AuthForm";
import { Card } from "app/components/ui/card";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card
        className="p-8 w-full max-w-md bg-amber-50 rounded-[50px] border-4 border-red-500 shadow-md"
        style={{
          borderRadius: "80px",
          borderWidth: "5px",
        }}
      >
        <h2
          className="text-4xl font-bold text-center mb-6"
          style={{ fontFamily: "Gravitas One, sans-serif", color: "#FF0000" }}
        >
          CAN GALÁN
        </h2>

        <AuthForm />
      </Card>
    </div>
  );
}
