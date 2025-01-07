import { Apple, Dumbbell, Home, MessageCircle, Play } from "lucide-react-native";
import { createFilledIcon } from "./customFilledIcon";
import { iconWithClassName } from "./iconWithClassName";
import { BarChartFilled } from "./BarChartIcon";

const AppleFilled = createFilledIcon(Apple);
const DumbbellFilled = createFilledIcon(Dumbbell);
const HomeFilled = createFilledIcon(Home);
const MessageCircleFilled = createFilledIcon(MessageCircle);
const PlayFilled = createFilledIcon(Play);

iconWithClassName([AppleFilled, DumbbellFilled, HomeFilled, MessageCircleFilled, BarChartFilled, PlayFilled]);

export { AppleFilled, DumbbellFilled, HomeFilled, MessageCircleFilled, BarChartFilled, PlayFilled };
