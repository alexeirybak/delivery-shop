export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface FlowchartNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
}

export interface NetworkGraph {
  nodes: Array<{ id: string; label: string }>;
  edges: Array<{ from: string; to: string }>;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
  }>;
}

export interface PieChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

export interface RadarChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
  }>;
}

export interface LineChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }>;
}

export interface ComparisonTableData {
  headers: string[];
  rows: Array<Record<string, string | number>>;
}

export interface RoadmapData {
  milestones: Array<{
    title: string;
    date: string;
    description: string;
    completed?: boolean;
  }>;
}

export interface TimelineData {
  events: Array<{
    date: string;
    title: string;
    description: string;
  }>;
}

export interface FlashcardData {
  flashcards: Array<{
    front: string;
    back: string;
  }>;
}

export interface GlossaryData {
  terms: Array<{
    term: string;
    definition: string;
  }>;
}

export interface RoleplayScenario {
  title: string;
  characters: Array<{
    name: string;
    description: string;
  }>;
  scenes: Array<{
    setting: string;
    dialogue: Array<{
      character: string;
      line: string;
    }>;
  }>;
}
