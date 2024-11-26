import { Routine } from "~/lib/types";

export interface Message {
  id: string;
  content: TaggedSection[];
  sender: "user" | "ai";
  timestamp: string;
}

export interface TaggedSection {
  tag: "text" | "routine" | "analysis" | "summary";
  content: string | Routine | null;
}

export interface ChatContext {
  type: "knowledge" | "routine_creation";
  confidence: number;
  requiresData: {
    userProfile: boolean;
    exerciseDatabse: boolean;
    existingRoutines: boolean;
  };
}
