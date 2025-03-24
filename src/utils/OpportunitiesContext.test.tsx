import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OpportunitiesProvider, useOpportunities } from "../context/OpportunitiesContext.jsx";

// Helper component to test the context
const TestComponent = () => {
  const { opportunities, addOpportunity, deleteOpportunity, updateOpportunity } = useOpportunities();
  const [newOpportunity, setNewOpportunity] = React.useState({
    title: "",
    organizer: "",
    shortDescription: "",
    description: "",
    image: "",
    views: "",
    endDate: "",
  });

  return (
    <div>
      <div>
        <h2>Opportunities</h2>
        {opportunities.map((opp, index) => (
          <div key={index} data-testid="opportunity">
            <span>{opp.title}</span>
            <button
              data-testid={`delete-button-${opp.title}`}
              onClick={() => deleteOpportunity(opp.title)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <input
        data-testid="title-input"
        value={newOpportunity.title}
        onChange={(e) =>
          setNewOpportunity({ ...newOpportunity, title: e.target.value })
        }
      />
      <button
        data-testid="add-button"
        onClick={() => addOpportunity({ ...newOpportunity, title: newOpportunity.title })}
      >
        Add
      </button>

      <input
        data-testid="update-title-input"
        value={newOpportunity.title}
        onChange={(e) =>
          setNewOpportunity({ ...newOpportunity, title: e.target.value })
        }
      />
      <button
        data-testid="update-button"
        onClick={() => updateOpportunity("Tech Innovators Summit", newOpportunity)}
      >
        Update
      </button>
    </div>
  );
};

// Test suite
describe("OpportunitiesContext CRUD Operations", () => {
  it("should add a new opportunity", async () => {
    render(
      <OpportunitiesProvider>
        <TestComponent />
      </OpportunitiesProvider>
    );

    // Add a new opportunity
    fireEvent.change(screen.getByTestId("title-input"), {
      target: { value: "New Opportunity" },
    });
    fireEvent.click(screen.getByTestId("add-button"));

    // Check if the new opportunity is added
    await waitFor(() => {
      expect(screen.getByText("New Opportunity")).toBeInTheDocument();
    });
  });

  it("should delete an opportunity", async () => {
    render(
      <OpportunitiesProvider>
        <TestComponent />
      </OpportunitiesProvider>
    );

    // Wait for the initial opportunity to be rendered
    await waitFor(() => {
      expect(screen.getByText("Tech Innovators Summit")).toBeInTheDocument();
    });

    // Delete the opportunity
    fireEvent.click(screen.getByTestId("delete-button-Tech Innovators Summit"));

    // Check if the opportunity is deleted
    await waitFor(() => {
      expect(screen.queryByText("Tech Innovators Summit")).not.toBeInTheDocument();
    });
  });

  it("should update an opportunity", async () => {
    render(
      <OpportunitiesProvider>
        <TestComponent />
      </OpportunitiesProvider>
    );

    // Wait for the initial opportunity to be rendered
    await waitFor(() => {
      expect(screen.getByText("Tech Innovators Summit")).toBeInTheDocument();
    });

    // Update the opportunity
    fireEvent.change(screen.getByTestId("update-title-input"), {
      target: { value: "Updated Title" },
    });
    fireEvent.click(screen.getByTestId("update-button"));

    // Check if the opportunity is updated
    await waitFor(() => {
      expect(screen.getByText("Updated Title")).toBeInTheDocument();
    });
  });
});