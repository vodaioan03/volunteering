"use client";
import { useState } from "react";
import UpdateForm from "./UpdateForm";

export default function UpdateFormPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Update Opportunity</button>
      {isModalOpen && (
        <UpdateForm 
          onClose={() => setIsModalOpen(false)}
          onUpdateOpportunity={() => {}}
          initialData={{
            name: "",
            organizer: "",
            shortDescription: "",
            endDate: "",
            image: ""
          }}
        />
      )}
    </>
  );
}