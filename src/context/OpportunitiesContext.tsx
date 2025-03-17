"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Opportunity {
  title: string;
  organizer: string;
  shortDescription: string;
  description: string;
  image: string;
}

interface OpportunitiesContextType {
  opportunities: Opportunity[];
  addOpportunity: (opp: Opportunity) => void;
  deleteOpportunity: (title: string) => void;
  updateOpportunity: (title:string,opp: Opportunity) => void;
}

const OpportunitiesContext = createContext<OpportunitiesContextType | undefined>(undefined);

export const OpportunitiesProvider = ({ children }: { children: ReactNode }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    { title: "Opportunity 1", organizer: "Organizer 1", shortDescription: "Short Description", description: "Description", image: "/logo.png" },
    { title: "Opportunity 2", organizer: "Organizer 2", shortDescription: "Short Description", description: "Description", image: "/logo.png" },
    { title: "Opportunity 3", organizer: "Organizer 3", shortDescription: "Short Description", description: "Description", image: "/logo.png" },
  ]);

  const addOpportunity = (opp: Opportunity) => {
    setOpportunities([...opportunities, opp]);
  };

  const deleteOpportunity = (title: string) => {
    setOpportunities(opportunities.filter((opp) => opp.title !== title));
  };

  const updateOpportunity = (title: string, updatedOpportunity: Opportunity) => {
    console.log("aici")
    setOpportunities((prevOpportunities) =>
      prevOpportunities.map((opp) =>
        opp.title === title ? { ...opp, ...updatedOpportunity } : opp
      )
    );
  };
  
  return (
    <OpportunitiesContext.Provider value={{ opportunities, addOpportunity, deleteOpportunity,updateOpportunity }}>
      {children}
    </OpportunitiesContext.Provider>
  );
};

export const useOpportunities = () => {
  const context = useContext(OpportunitiesContext);
  if (!context) {
    throw new Error("useOpportunities must be used within an OpportunitiesProvider");
  }
  return context;
};
