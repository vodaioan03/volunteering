"use client";
import { useState } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Sign In</button>
      {isModalOpen && <SignInForm onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
