import { Content, Context } from "~/lib/Chat/types";
import { Routine } from "../types";
import { generateId, parseJSON } from "../utils";

export function parseTaggedResponse(text: string): [string, Content[]] {
  const regex = /<(.*?)>([^]*?)<\/.*?>/g;

  const matches = Array.from(text.matchAll(regex))
    .filter((match) => match[1] && match[2])
    .map((match): Content | null => {
      const tag = match[1] as "text" | "routine" | "analysis" | "context";
      const content = match[2].trim();

      switch (tag) {
        case "routine":
          const routine = parseJSON<Routine>(content);
          if (routine) {
            routine.id = generateId();
          }
          return routine;
        case "text":
          return content;
        case "analysis":
          console.log("analysis", content);
          return null;
        case "context":
          return { context: content } as Context;
        default:
          console.error("Invalid tag in response:", tag);
          return null;
      }
    })
    .filter((content) => content !== null);

  const message = matches.find((match) => typeof match === "string") as string | undefined;
  const content = matches.filter((match) => typeof match !== "string") as Content[];
  return [message || "", content];
}
