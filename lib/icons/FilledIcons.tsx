import { Apple, Dumbbell, Home, MessageCircle, Play, MessageSquare } from "lucide-react-native";
import { createFilledIcon } from "./customFilledIcon";
import { iconWithClassName } from "./iconWithClassName";
import { BarChartFilled } from "./BarChartIcon";

const AppleFilled = createFilledIcon(Apple);
const DumbbellFilled = createFilledIcon(Dumbbell);
const HomeFilled = createFilledIcon(Home);
const MessageCircleFilled = createFilledIcon(MessageCircle);
const PlayFilled = createFilledIcon(Play);
const MessageSquareFilled = createFilledIcon(MessageSquare)

iconWithClassName([AppleFilled, DumbbellFilled, HomeFilled, MessageCircleFilled, BarChartFilled, PlayFilled, MessageSquareFilled]);

export { AppleFilled, DumbbellFilled, HomeFilled, MessageCircleFilled, BarChartFilled, PlayFilled, MessageSquareFilled };
