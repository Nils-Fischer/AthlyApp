import { Routine } from "~/lib/types";

export interface Message {
  id: string;
  content: TaggedSection[];
  sender: "user" | "ai";
  timestamp: string;
}

type TextContent = string;
type AnalysisContent = string;
type SummaryContent = string;
type RoutineContent = Routine | null;
type UnknownContent = string;

export type TaggedSection =
  | { tag: "text"; content: TextContent }
  | { tag: "routine"; content: RoutineContent }
  | { tag: "analysis"; content: AnalysisContent }
  | { tag: "summary"; content: SummaryContent }
  | { tag: "unknown"; content: UnknownContent };

export interface ChatContext {
  type: "knowledge" | "routine_creation";
  confidence: number;
  requiresData: {
    userProfile: boolean;
    exerciseDatabse: boolean;
    existingRoutines: boolean;
  };
}
