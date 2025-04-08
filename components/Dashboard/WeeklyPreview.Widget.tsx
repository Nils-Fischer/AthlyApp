import { Pressable } from "react-native";
import { View } from "react-native";
import { Check, BicepsFlexed, BedDouble } from "~/lib/icons/Icons";
import { CardLabel, P } from "../ui/typography";
import { getDailyIndex, WeekDay, WeeklySchedule } from "~/lib/workoutPlanning";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const WeeklyPreviewWidget = ({ schedule }: { schedule: WeeklySchedule }) => {
  const today = getDailyIndex(new Date());
  // Helper function to get day abbreviation
  const getDayAbbreviation = (day: number) => {
    const days = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
    return days[day];
  };

  // Helper function to render the correct icon based on activity
  const renderDayIcon = (dayInfo: WeekDay, isToday: boolean) => {
    if (Array.isArray(dayInfo.activity)) {
      // Completed session
      return (
        <Pressable className="rounded-full bg-success p-2 shadow-sm">
          <Check size={24} className={isToday ? "text-white" : "text-white/70"} />
        </Pressable>
      );
    } else if (dayInfo.activity) {
      // Planned workout
      return (
        <Pressable className="rounded-full bg-muted p-2 shadow-sm">
          <BicepsFlexed size={24} className={isToday ? "text-primary" : "text-muted-foreground"} />
        </Pressable>
      );
    } else {
      // Rest day
      return (
        <Pressable className="rounded-full bg-muted p-2 shadow-sm">
          <BedDouble size={24} className={isToday ? "text-primary" : "text-muted-foreground"} />
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
            const isToday = dayIndex === today;

            return (
              <View key={dayIndex} className="flex-column items-center gap-2">
                {dayInfo ? (
                  renderDayIcon(dayInfo, isToday)
                ) : (
                  <Pressable
                    className={`rounded-full bg-muted p-2 shadow-sm ${isToday ? "border-2 border-primary" : ""}`}
                  >
                    <BedDouble size={24} className="text-muted-foreground" />
                  </Pressable>
                )}
                <CardLabel className={isToday ? "font-bold text-primary" : ""}>
                  {getDayAbbreviation(dayIndex)}
                </CardLabel>
              </View>
            );
          })}
        </View>
      </CardContent>
    </Card>
  );
};
