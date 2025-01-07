import { SchemaType } from "@google/generative-ai";
import { RoutineFormData } from "./promptTemplates";

export const googlePrompts = {
  routineCreationSchema: {
    type: SchemaType.OBJECT,
    properties: {
      id: {
        type: SchemaType.NUMBER,
        description: "ID of the routine (use 0 for new routines)",
        nullable: false,
      },
      name: {
        type: SchemaType.STRING,
        description: "Name of the workout routine",
        nullable: false,
      },
      description: {
        type: SchemaType.STRING,
        description: "Brief description of the routine's focus and benefits",
        nullable: true,
      },
      frequency: {
        type: SchemaType.NUMBER,
        description: "Weekly training frequency",
        nullable: false,
      },
      active: {
        type: SchemaType.BOOLEAN,
        description: "Always set to false",
        nullable: false,
      },
      workouts: {
        type: SchemaType.ARRAY,
        description: "List of workouts in the routine",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: {
              type: SchemaType.NUMBER,
              description: "ID of the workout (use 0 for new workouts)",
              nullable: false,
            },
            name: {
              type: SchemaType.STRING,
              description: "Name of the workout (e.g., 'Upper Body Day 1')",
              nullable: false,
            },
            description: {
              type: SchemaType.STRING,
              description: "Brief description of this workout's focus",
              nullable: true,
            },
            duration: {
              type: SchemaType.NUMBER,
              description: "Estimated duration in minutes",
              nullable: true,
            },
            exercises: {
              type: SchemaType.ARRAY,
              description: "List of exercises in the workout",
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  exerciseId: {
                    type: SchemaType.NUMBER,
                    description: "ID of the exercise from the exercise list",
                    nullable: false,
                  },
                  alternatives: {
                    type: SchemaType.ARRAY,
                    description: "Array of alternative exercise IDs",
                    items: {
                      type: SchemaType.NUMBER,
                    },
                    nullable: false,
                  },
                  sets: {
                    type: SchemaType.NUMBER,
                    description: "Number of sets",
                    nullable: false,
                  },
                  reps: {
                    type: SchemaType.NUMBER,
                    description: "Number of repetitions",
                    nullable: false,
                  },
                  restPeriod: {
                    type: SchemaType.NUMBER,
                    description: "Rest period between sets in seconds",
                    nullable: true,
                  },
                  notes: {
                    type: SchemaType.STRING,
                    description: "Optional exercise-specific instructions",
                    nullable: true,
                  },
                },
                required: ["exerciseId", "alternatives", "sets", "reps"],
              },
            },
          },
          required: ["id", "name", "exercises"],
        },
      },
    },
    required: ["id", "name", "frequency", "workouts", "active"],
  },

  context: (exerciseList: string) => `You are Alex, a knowledgeable and friendly personal trainer AI. 
  You are able to edit and create workout routines based on the user's requirements.
  This is the list of available exercises:
  ${exerciseList}
  `,

  promptForRoutineCreationWithForm: (formData: RoutineFormData): string => `
      Requirements:
      - Main request: ${formData.mainPrompt}
      ${formData.goals ? `- Goals: ${formData.goals}` : ""}
      ${formData.equipment ? `- Available equipment: ${formData.equipment}` : ""}
      ${formData.frequency ? `- Preferred frequency: ${formData.frequency}` : ""}
      ${formData.limitations ? `- Limitations/Restrictions: ${formData.limitations}` : ""}
  
      Create a workout routine that:
      1. Only uses exercises from the provided list
      2. Considers the user's limitations and equipment
      3. Provides realistic alternatives for each exercise
      4. Matches the intensity to user's experience level
      5. Structure the routine to match the requested frequency
      6. Use the users language
      7. Follow these exercise quantity guidelines:
         - For a 90-minute workout: 8-10 exercises
         - For a 60-minute workout: 6-8 exercises
         - For a 45-minute workout: 5-6 exercises
         - For a 30-minute workout: 4-5 exercises
         Each exercise should typically include:
         - 3-4 sets for compound movements
         - 2-3 sets for isolation exercises
         - Rest periods: 60-90 seconds for compound exercises, 30-60 seconds for isolation
         Only deviate from these guidelines if specifically requested by the user
  
      Return the routine as a JSON object following the specified schema.
      8. Provide at least 2 alternative exercises for each exercise
    `,
};
