import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface ChatAvatarProps {
  isAI: boolean;
}

export const ChatAvatar: React.FC<ChatAvatarProps> = ({ isAI }) => (
  <Avatar alt={""}>
    <AvatarImage source={{ uri: "/api/placeholder/40/40" }} />
    <AvatarFallback>{isAI ? "AI" : "DU"}</AvatarFallback>
  </Avatar>
);