import { MessageCircle } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";
import { createFilledIcon } from "./customFilledIcon";

iconWithClassName(MessageCircle);
const MessageCircleFilled = createFilledIcon(MessageCircle);
iconWithClassName(MessageCircleFilled);

export { MessageCircle, MessageCircleFilled };
