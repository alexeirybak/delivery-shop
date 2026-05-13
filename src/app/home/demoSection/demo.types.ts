export interface DemoSectionProps {
  telemetryMessages: string[];
  schedulerCells: Array<{
    day: string;
    task: string;
    active: boolean;
  }>;
  demos: string[];
}