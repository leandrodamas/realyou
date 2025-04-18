
export interface ScheduleSlot {
  day: string;
  slots: string[];
  active: boolean;
}

export interface MatchedPerson {
  name: string;
  profession: string;
  avatar: string;
  schedule: ScheduleSlot[];
}
