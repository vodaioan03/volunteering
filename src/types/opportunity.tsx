/**
 * Base opportunity interface
 */
export interface Opportunity {
  /** Unique identifier (server-generated) */
  id?: string;
  /** Title of the opportunity (3-100 chars) */
  title: string;
  /** Organization hosting (2-50 chars) */
  organizer: string;
  /** Brief summary (max 150 chars) */
  shortDescription: string;
  /** Full description (max 2000 chars) */
  description: string;
  /** URL to an image/logo */
  image: string;
  /** Formatted view count (e.g. "1.5k") */
  views: string;
  /** ISO date string (YYYY-MM-DD) */
  endDate: string;
  /** Creation timestamp (ISO) */
  createdAt?: string;
  /** Last update timestamp (ISO) */
  updatedAt?: string;
}
// Add this interface near your other types
export interface Application {
  id?: string;
  opportunityId: string;
  applicantId: string;
  applicationDate: string;
  status?: string;
  // Add any other application-specific fields
}


/**
 * Type for creating new opportunities (excludes server-managed fields)
 */
export type OpportunityCreate = Omit<Opportunity, 'id'|'views'|'createdAt'|'updatedAt'> & {
  views?: never; // Explicitly exclude
};

/**
 * Type for updating opportunities (all fields optional except identifier)
 */
export type OpportunityUpdate = Partial<OpportunityCreate> & {
  title: string; // Required for identification
  image?: string; // Make explicitly optional
};

/**
 * Type for API responses (all server fields required)
 */
export interface OpportunityResponse extends Opportunity {
  id: string;
  createdAt: string;
  updatedAt: string;
}