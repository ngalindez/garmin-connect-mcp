import { z } from 'zod';
import { dateString } from '../constants';

export type WorkoutStepDto = {
  type: string;
  stepOrder: number;
  stepType: string;
  endConditionType: string;
  endConditionValue?: number;
  targetType?: string;
  targetValueLow?: number;
  targetValueHigh?: number;
  description?: string;
};

export const workoutStepSchema = z.object({
  type: z
    .enum(['ExecutableStepDTO', 'RepeatGroupDTO'])
    .default('ExecutableStepDTO')
    .describe('Step type. Use ExecutableStepDTO for normal steps, RepeatGroupDTO for repeat groups'),
  stepOrder: z.number().min(1).describe('Order of the step within the segment (starts at 1)'),
  stepType: z
    .enum([
      'warmup',
      'cooldown',
      'interval',
      'recovery',
      'rest',
      'repeat',
      'other',
    ])
    .describe('Type of workout step'),
  endConditionType: z
    .enum([
      'time',
      'distance',
      'calories',
      'heart.rate',
      'iterations',
      'lap.button',
      'fixed.rest',
    ])
    .describe('What ends this step. Use "lap.button" for open-ended steps, "time" for timed steps (value in seconds), "distance" for distance steps (value in meters), "iterations" for repeat groups'),
  endConditionValue: z
    .number()
    .optional()
    .describe('Value for end condition. Seconds for time, meters for distance, count for iterations. Not needed for lap.button'),
  targetType: z
    .enum([
      'no.target',
      'heart.rate.zone',
      'pace.zone',
      'power.zone',
      'speed.zone',
      'cadence',
    ])
    .optional()
    .describe('Target metric type. Defaults to no.target'),
  targetValueLow: z
    .number()
    .optional()
    .describe('For zone targets (heart.rate.zone, power.zone): the zone number (1-5). For pace/speed/cadence: lower bound of range'),
  targetValueHigh: z
    .number()
    .optional()
    .describe('Upper bound of target range. Not used for zone targets'),
  description: z.string().optional().describe('Optional description or notes for this step'),
});

export type CreateWorkoutDto = {
  workoutName: string;
  sportType: string;
  steps: WorkoutStepDto[];
  description?: string;
};

export const createWorkoutSchema = z.object({
  workoutName: z.string().min(1).max(255).describe('Name of the workout (e.g. "5K Tempo Run")'),
  sportType: z
    .enum([
      'running',
      'cycling',
      'swimming',
      'walking',
      'hiking',
      'strength_training',
      'cardio_training',
      'other',
    ])
    .describe('Sport type for the workout'),
  steps: z
    .array(workoutStepSchema)
    .min(1)
    .describe('Ordered list of workout steps. Typically starts with warmup and ends with cooldown'),
  description: z.string().optional().describe('Optional workout description'),
});

export type DeleteWorkoutDto = {
  workoutId: string;
};

export const deleteWorkoutSchema = z.object({
  workoutId: z.string().describe('The workout ID to delete'),
});

export type ScheduleWorkoutDto = {
  workoutId: string;
  date: string;
};

export const scheduleWorkoutSchema = z.object({
  workoutId: z.string().describe('The workout ID to schedule'),
  date: dateString.describe('Date to schedule the workout in YYYY-MM-DD format'),
});
