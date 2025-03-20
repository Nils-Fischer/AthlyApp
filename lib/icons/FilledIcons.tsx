import { Apple, Dumbbell, Home, MessageCircle, Play, MessageSquare, Pause, Square } from "lucide-react-native";
import { createFilledIcon } from "./customFilledIcon";
import { iconWithClassName } from "./iconWithClassName";
import { BarChartFilled } from "./BarChartIcon";

const AppleFilled = createFilledIcon(Apple);
const DumbbellFilled = createFilledIcon(Dumbbell);
const HomeFilled = createFilledIcon(Home);
const MessageCircleFilled = createFilledIcon(MessageCircle);
const PlayFilled = createFilledIcon(Play);
const MessageSquareFilled = createFilledIcon(MessageSquare);
const PauseFilled = createFilledIcon(Pause);
const SquareFilled = createFilledIcon(Square);

iconWithClassName([
  AppleFilled,
  DumbbellFilled,
  HomeFilled,
  MessageCircleFilled,
  BarChartFilled,
  PlayFilled,
  MessageSquareFilled,
  PauseFilled,
  SquareFilled,
]);

export {
  AppleFilled,
  DumbbellFilled,
  HomeFilled,
  MessageCircleFilled,
  BarChartFilled,
  PlayFilled,
  MessageSquareFilled,
  PauseFilled,
  SquareFilled,
};
