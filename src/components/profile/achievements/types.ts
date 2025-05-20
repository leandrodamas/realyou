
export interface Achievement {
  id: number;
  name: string;
  description: string;
  progress: number;
  iconName: string;
  color: string;
  completed?: boolean;
}
