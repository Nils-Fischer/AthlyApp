import { Dumbbell } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";
import { createFilledIcon } from "./customFilledIcon";

iconWithClassName(Dumbbell);
const DumbbellFilled = createFilledIcon(Dumbbell);
iconWithClassName(DumbbellFilled);

export { Dumbbell, DumbbellFilled };
