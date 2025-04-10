"use client";
import AuthForm from "app/components/ui/AuthForm";
import { Card } from "app/components/ui/card";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <Card className="p-10 w-full max-w-md bg-white rounded-3xl border-2 border-red-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="text-center mb-8">
          <h2
            className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent"
            style={{ fontFamily: "Gravitas One, cursive" }}
          >
            CAN GALÁN
          </h2>
          <p className="text-gray-600 text-lg">
            Bienvenido! Por favor inicia sesión.
          </p>
        </div>

        <AuthForm />
      </Card>
    </div>
  );
}
