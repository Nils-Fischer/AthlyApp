import { Routine } from "~/lib/types";

export interface Message {
  id: string;
  content: TaggedSection[];
  sender: "user" | "ai";
  timestamp: string;
}

export interface TaggedSection {
  tag: string;
  content: string | Routine | null;
}
