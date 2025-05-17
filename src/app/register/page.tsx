"use client";
import { useState } from "react";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Register</button>
      {isModalOpen && <RegisterForm onClose={() => setIsModalOpen(false)} />}
    </>
  );
}