import {
  Apple,
  User,
  Dumbbell,
  MessageCircle,
  Play,
  MessageSquare,
  Pause,
  Square,
  CircleUser,
} from "lucide-react-native";
import { createFilledIcon } from "./customFilledIcon";
import { BarChartFilled } from "./BarChartIcon";
import { House } from "phosphor-react-native";

// Import the shared helper function
import { iconWithClassName } from "./iconWithClassName";

const AppleFilled = createFilledIcon(Apple);
const CircleUserFilled = createFilledIcon(CircleUser);
const DumbbellFilled = createFilledIcon(Dumbbell);
const HouseFilled = createFilledIcon(House);
const MessageCircleFilled = createFilledIcon(MessageCircle);
const MessageSquareFilled = createFilledIcon(MessageSquare);
const PauseFilled = createFilledIcon(Pause);
const PlayFilled = createFilledIcon(Play);
const SquareFilled = createFilledIcon(Square);
const UserFilled = createFilledIcon(User);

iconWithClassName([
  AppleFilled,
  BarChartFilled,
  CircleUserFilled,
  DumbbellFilled,
  HouseFilled,
  MessageCircleFilled,
  MessageSquareFilled,
  PauseFilled,
  PlayFilled,
  SquareFilled,
  UserFilled,
]);

export {
  AppleFilled,
  BarChartFilled,
  CircleUserFilled,
  DumbbellFilled,
  HouseFilled,
  MessageCircleFilled,
  MessageSquareFilled,
  PauseFilled,
  PlayFilled,
  SquareFilled,
  UserFilled,
};
