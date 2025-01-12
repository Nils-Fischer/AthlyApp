import { Image, Exercise, Routine } from "~/lib/types";

export interface Message {
  id: string;
  message: string;
  content: Content[];
  sender: "user" | "ai";
  timestamp: Date;
  status: "sent" | "sending" | "failed";
}

export type Content = string | Routine | Exercise | Image | Context;

export interface Context {
  context: string;
}
