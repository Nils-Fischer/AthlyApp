import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import Icon from "~/assets/images/icon.svg.png";

export const MessageAvatar = React.memo<{ isAI: boolean }>(({ isAI }) => (
  <Avatar className="h-8 w-8 rounded-none" alt={""}>
    {isAI ? (
      <>
        <AvatarImage source={Icon} />
        <AvatarFallback>
          <Text>AI</Text>
        </AvatarFallback>
      </>
    ) : (
      <>
        <AvatarImage source={{ uri: "/api/placeholder/32/32" }} />
        <AvatarFallback>
          <Text>ME</Text>
        </AvatarFallback>
      </>
    )}
  </Avatar>
));

MessageAvatar.displayName = "MessageAvatar";
