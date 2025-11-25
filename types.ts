export interface UserStats {
  age: number;
  dailyScreenTime: number; // in hours
}

export interface DayAllocation {
  sleep: number;
  work: number;
  commute: number;
  chores: number;
  social: number;
  hobbies: number;
  // The rest is calculated as "Doomscroll"
}

export interface RoastResponse {
  roast: string;
  alternativeActivity: string;
}

export enum AppStage {
  ONBOARDING = 'ONBOARDING',
  MOSAIC_MIRROR = 'MOSAIC_MIRROR',
  DAY_BUILDER = 'DAY_BUILDER'
}
