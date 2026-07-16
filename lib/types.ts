export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  category: string;
  description: string;
  benefits: string[];
  eligibility: {
    minAge?: number;
    maxAge?: number;
    gender?: "male" | "female" | "any";
    maxIncome?: number;
    occupation?: string[]; // e.g. ["farmer", "student", "msme"]
    states?: string[]; // empty/["all"] = nationwide
  };
  documents: string[];
  applyUrl: string;
}

export interface UserProfile {
  state: string;
  age: number;
  gender: "male" | "female" | "other";
  occupation: string;
  income: number;
  isStudent: boolean;
  isFarmer: boolean;
  isStartupFounder: boolean;
  isMsmeOwner: boolean;
  isWomanEntrepreneur: boolean;
  hasDisability: boolean;
  isSeniorCitizen: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
