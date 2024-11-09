import { Apple, Dumbbell, Home, MessageCircle } from "lucide-react-native";
import { createFilledIcon } from "./customFilledIcon";
import { iconWithClassName } from "./iconWithClassName";
import { BarChartFilled } from "./BarChartIcon";

const AppleFilled = createFilledIcon(Apple);
const DumbbellFilled = createFilledIcon(Dumbbell);
const HomeFilled = createFilledIcon(Home);
const MessageCircleFilled = createFilledIcon(MessageCircle);

iconWithClassName([
  AppleFilled,
  DumbbellFilled,
  HomeFilled,
  MessageCircleFilled,
  BarChartFilled,
]);

export {
  AppleFilled,
  DumbbellFilled,
  HomeFilled,
  MessageCircleFilled,
  BarChartFilled,
};
