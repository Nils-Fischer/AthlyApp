import { Apple } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";
import { createFilledIcon } from "./customFilledIcon";

iconWithClassName(Apple);
const AppleFilled = createFilledIcon(Apple);
iconWithClassName(AppleFilled);

export { Apple, AppleFilled };
