
export interface Achievement {
  id: number;
  name: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
  completed?: boolean;
}
