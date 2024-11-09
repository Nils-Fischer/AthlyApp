import { Home } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";
import { createFilledIcon } from "./customFilledIcon";

iconWithClassName(Home);
const HomeFilled = createFilledIcon(Home);
iconWithClassName(HomeFilled);

export { Home, HomeFilled };
