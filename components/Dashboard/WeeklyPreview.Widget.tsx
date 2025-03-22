import { Pressable } from "react-native";
import { View } from "react-native";
import { Check, BicepsFlexed, BedDouble } from "~/lib/icons/Icons";
import { P } from "../ui/typography";
import { WeekDay, WeeklySchedule } from "~/lib/workoutPlanning";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const WeeklyPreviewWidget = ({ schedule }: { schedule: WeeklySchedule }) => {
  // Helper function to get day abbreviation
  const getDayAbbreviation = (day: number) => {
    const days = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
    return days[day];
  };

  // Helper function to render the correct icon based on activity
  const renderDayIcon = (dayInfo: WeekDay) => {
    if (Array.isArray(dayInfo.activity)) {
      // Completed session
      return (
        <Pressable className="rounded-full bg-green-500 p-2 shadow-sm">
          <Check size={24} className="text-white" />
        </Pressable>
      );
    } else if (dayInfo.activity) {
      // Planned workout
      return (
        <Pressable className="rounded-full bg-secondary p-2 shadow-sm">
          <BicepsFlexed size={24} className="text-secondary-foreground" />
        </Pressable>
      );
    } else {
      // Rest day
      return (
        <Pressable className="rounded-full bg-muted p-2 shadow-sm">
          <BedDouble size={24} className="text-muted-foreground" />
        </Pressable>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Deine Woche</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-center justify-between">
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
            const dayInfo = schedule.get(dayIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6);

            return (
              <View key={dayIndex} className="flex-column items-center gap-2">
                {dayInfo ? (
                  renderDayIcon(dayInfo)
                ) : (
                  <Pressable className="rounded-full bg-muted p-2 shadow-sm">
                    <BedDouble size={24} className="text-muted-foreground" />
                  </Pressable>
                )}
                <P>{getDayAbbreviation(dayIndex)}</P>
              </View>
            );
          })}
        </View>
      </CardContent>
    </Card>
  );
};
