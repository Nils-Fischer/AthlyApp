import { SafeAreaView } from "react-native";
import WorkoutCompletionModal from "~/components/WorkoutCompletion/WorkoutCompletionModal";

export default function WorkoutCompletion() {
  return (
    <SafeAreaView>
      <WorkoutCompletionModal
        workoutName="Oberkörper Workout"
        date={new Date()}
        duration={45}
        totalWeight={1250}
        caloriesBurned={320}
        trainedMuscles={["Brust", "Rücken", "Schultern", "Bizeps", "Trizeps"]}
        prs={[
          { exerciseName: "Bankdrücken", weight: 80, percentageImprovement: 5.3 },
          { exerciseName: "Bizeps Curls", weight: 20, percentageImprovement: 11.1 },
          { exerciseName: "Schulterdrücken", weight: 25 },
          { exerciseName: "Klimmzüge", weight: 0 },
        ]}
        aiCoachFeedback={
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(
                "Dein Oberkörper-Training war sehr effektiv! Besonders beeindruckend ist deine Steigerung beim Bankdrücken und Bizeps Curls. Überlege vor deinem nächsten Training, dich auch auf den Trizeps zu konzentrieren, um ein ausgewogenes Training zu gewährleisten."
              );
            }, 5000);
          })
        }
      />
    </SafeAreaView>
  );
}
