import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GarminClient } from '../client';
import { createWorkoutSchema, deleteWorkoutSchema, scheduleWorkoutSchema } from '../dtos';

export function registerWorkoutTools(server: McpServer, client: GarminClient): void {
  server.registerTool(
    'create_workout',
    {
      description:
        'Create a custom workout with structured steps (warmup, intervals, recovery, cooldown). ' +
        'Each step defines a type, end condition (time/distance/lap.button), and optional target (heart rate zone, pace). ' +
        'Use get_workouts to see existing workouts for reference on step structure',
      inputSchema: createWorkoutSchema.shape,
    },
    async ({ workoutName, sportType, steps, description }) => {
      const data = await client.createWorkout({ workoutName, sportType, steps, description });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      };
    },
  );

  server.registerTool(
    'delete_workout',
    {
      description: 'Delete a workout permanently. This action cannot be undone. Use get_workouts to find workout IDs',
      inputSchema: deleteWorkoutSchema.shape,
    },
    async ({ workoutId }) => {
      const data = await client.deleteWorkout(workoutId);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data ?? 'Workout deleted', null, 2) }],
      };
    },
  );

  server.registerTool(
    'schedule_workout',
    {
      description:
        'Schedule a workout on a specific date in the Garmin calendar. ' +
        'The workout must exist first (use create_workout or get_workouts to find existing ones)',
      inputSchema: scheduleWorkoutSchema.shape,
    },
    async ({ workoutId, date }) => {
      const data = await client.scheduleWorkout(workoutId, date);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data ?? 'Workout scheduled', null, 2) }],
      };
    },
  );
}
