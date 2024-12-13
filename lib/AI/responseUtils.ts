import { TaggedSection } from "~/lib/Chat/types";
import { Routine } from "../types";
import { generateId, parseJSON } from "../utils";

export function parseTaggedResponse(text: string): TaggedSection[] {
  const regex = /<(.*?)>([^]*?)<\/.*?>/g;

  return Array.from(text.matchAll(regex))
    .filter((match) => match[1] && match[2])
    .map((match): TaggedSection => {
      const tag = match[1] as "text" | "routine" | "analysis" | "summary";
      const content = match[2].trim();

      switch (tag) {
        case "routine":
          const routine = parseJSON<Routine>(content);
          if (routine) {
            routine.id = generateId();
          }
          return { tag, content: routine ?? null };
        case "text":
        case "analysis":
        case "summary":
          return { tag, content };
        default:
          console.error("Invalid tag in response:", tag);
          return { tag: "unknown", content } as TaggedSection;
      }
    });
}

export function extractRoutineFromResponse(response: string): Routine | null {
  const sections = parseTaggedResponse(response);
  const routineSection = sections.find((section) => section.tag === "routine");
  return routineSection?.content as Routine | null;
}
