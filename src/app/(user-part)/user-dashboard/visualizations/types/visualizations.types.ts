import { FileData, GenerationMode, GenerationSettings, LoadedChat, Message, UploadedImage } from "../../types";

export type VisualizationMode =
  | "mindmap"
  | "flowchart"
  | "network"
  | "barchart"
  | "piechart"
  | "linechart"
  | "radarchart"
  | "visualization_comparison"
  | "roadmap"
  | "hierarchy"
  | "timeline"
  | "flashcards"
  | "glossary"
  | "roleplay"

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
  position?: { x: number; y: number };
}

export interface FlowchartNode {
  id: string;
  type: "start" | "end" | "process" | "decision" | "input" | "output";
  label: string;
  children?: FlowchartNode[];
  position?: { x: number; y: number };
}

export interface NetworkNode {
  id: string;
  label: string;
  group?: string;
  value?: number;
  position?: { x: number; y: number };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  value?: number;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}

export interface PieChartDataItem {
  name: string;
  value: number;
}

export interface PieChartData {
  data: PieChartDataItem[];
}

export interface RadarChartDataset {
  label: string;
  data: number[];
}

export interface RadarChartData {
  labels: string[];
  datasets: RadarChartDataset[];
}

export interface LineChartDataset {
  label: string;
  data: number[];
}

export interface LineChartData {
  labels: string[];
  datasets: LineChartDataset[];
}

export interface ComparisonTableData {
  headers: string[];
  rows: string[][];
  rowHeaders?: string[];
}

export interface RoadmapTask {
  name: string;
  completed: boolean;
}

export interface RoadmapPhase {
  name: string;
  tasks: RoadmapTask[];
  duration?: string;
}

export interface RoadmapData {
  phases: RoadmapPhase[];
  title?: string;
  description?: string;
}

export interface HierarchyNode {
  id: string;
  name: string;
  level: number;
  description?: string;
  children?: HierarchyNode[];
}

export type HierarchyData = HierarchyNode;

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  location?: string;
  participants?: string[];
  tags?: string[];
}

export interface TimelineData {
  title?: string;
  description?: string;
  events: TimelineEvent[];
}

export interface Flashcard {
  id?: string;
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface FlashcardData {
  id?: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GlossaryTerm {
  id?: string;
  term: string;
  definition: string;
  pronunciation?: string;
  example?: string;
  relatedTerms?: string[];
  tags?: string[];
  category?: string;
}

export interface GlossaryData {
  id?: string;
  title: string;
  description?: string;
  terms: GlossaryTerm[];
  category?: string;
}

export interface RoleplayChoice {
  id: string;
  text: string;
  consequences: string;
  impact: {
    budget?: number;
    time?: number;
    morale?: number;
    reputation?: number;
    health?: number;
  };
}

export interface RoleplayStats {
  budget?: number;
  time?: number;
  morale?: number;
  reputation?: number;
  health?: number;
}

export interface RoleplayHistory {
  step: number;
  situation: string;
  userChoice: string;
  consequences: string;
  statsAfter: RoleplayStats;
}

export interface RoleplayScenario {
  id?: string;
  title: string;
  description?: string;
  role: string;
  situation: string;
  difficulty?: "beginner" | "intermediate" | "expert";
  choices: RoleplayChoice[];
  history?: RoleplayHistory[];
  stats?: RoleplayStats;
}

export type VisualizationType =
  | "mindmap"
  | "flowchart"
  | "network"
  | "barchart"
  | "piechart"
  | "radarchart"
  | "linechart"
  | "visualization_comparison"
  | "roadmap"
  | "hierarchy"
  | "timeline"
  | "flashcards"
  | "glossary"
  | "roleplay";

export type VisualizationDataMap = {
  mindmap: MindMapNode;
  flowchart: FlowchartNode;
  network: NetworkGraph;
  barchart: ChartData;
  piechart: PieChartData;
  radarchart: RadarChartData;
  linechart: LineChartData;
  visualization_comparison: ComparisonTableData;
  roadmap: RoadmapData;
  hierarchy: HierarchyData;
  timeline: TimelineData;
  flashcards: FlashcardData;
  glossary: GlossaryData;
  roleplay: RoleplayScenario;
};

export type VisualizationData<T extends VisualizationType = VisualizationType> =
  T extends keyof VisualizationDataMap ? VisualizationDataMap[T] : never;

export type AnyVisualizationData =
  | MindMapNode
  | FlowchartNode
  | NetworkGraph
  | ChartData
  | PieChartData
  | RadarChartData
  | LineChartData
  | ComparisonTableData
  | RoadmapData
  | HierarchyData
  | TimelineData
  | FlashcardData
  | GlossaryData
  | RoleplayScenario;

export interface SelectedVisualization {
  type: VisualizationType;
  data: AnyVisualizationData;
}

export interface MindMapViewerProps {
  data: MindMapNode;
  onClose?: () => void;
  onSave?: (data: MindMapNode) => void;
  isSaving?: boolean;
}

export interface FlowchartViewerProps {
  data: FlowchartNode;
  onClose?: () => void;
  onSave?: (data: FlowchartNode) => void;
  isSaving?: boolean;
}

export interface NetworkGraphViewerProps {
  data: NetworkGraph;
  onClose?: () => void;
  onSave?: (data: NetworkGraph) => void;
  isSaving?: boolean;
}

export interface ChartViewerProps {
  data: ChartData;
  onClose?: () => void;
  onSave?: (data: ChartData) => void;
  isSaving?: boolean;
}

export interface PieChartViewerProps {
  data: PieChartData;
  onClose?: () => void;
  onSave?: (data: PieChartData) => void;
  isSaving?: boolean;
}

export interface RadarChartViewerProps {
  data: RadarChartData;
  onClose?: () => void;
  onSave?: (data: RadarChartData) => void;
  isSaving?: boolean;
}

export interface LineChartViewerProps {
  data: LineChartData;
  onClose?: () => void;
  onSave?: (data: LineChartData) => void;
  isSaving?: boolean;
}

export interface ComparisonTableViewerProps {
  data: ComparisonTableData;
  onClose?: () => void;
  onSave?: (data: ComparisonTableData) => void;
  isSaving?: boolean;
}

export interface RoadmapViewerProps {
  data: RoadmapData;
  onClose?: () => void;
  onSave?: (data: RoadmapData) => void;
  isSaving?: boolean;
}

export interface HierarchyViewerProps {
  data: HierarchyData;
  onClose?: () => void;
  onSave?: (data: HierarchyData) => void;
  isSaving?: boolean;
}

export interface TimelineViewerProps {
  data: TimelineData;
  onClose?: () => void;
  onSave?: (data: TimelineData) => void;
  isSaving?: boolean;
}

export interface FlashcardsViewerProps {
  data: FlashcardData;
  onClose?: () => void;
  onSave?: (data: FlashcardData) => void;
  isSaving?: boolean;
}

export interface GlossaryViewerProps {
  data: GlossaryData;
  onClose?: () => void;
  onSave?: (data: GlossaryData) => void;
  isSaving?: boolean;
}

export interface RoleplayViewerProps {
  data: RoleplayScenario;
  onClose?: () => void;
  onSave?: (data: RoleplayScenario) => void;
  isSaving?: boolean;
}

export interface UseSendMessageParams {
  mode: GenerationMode;
  messages: Message[];
  isGenerating: boolean;
  setShowLoader: (show: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addUserMessage: (content: string, images?: UploadedImage[]) => Message;
  addStreamingMessage: () => string;
  updateStreamingContent: (id: string, content: string) => void;
  finalizeStreamingMessage: (id: string, content: string) => Message;
  setErrorMessage: (id: string, error: string) => void;
  saveChatToDatabase: (
    msgs: Message[],
    mode: GenerationMode,
    chatId: string | null,
  ) => Promise<string | null>;
  currentChatId: string | null;
  abortControllerRef: React.RefObject<AbortController | null>;
}

export interface UseSendMessageReturn {
  sendMessage: (
    customInput?: string,
    customImages?: UploadedImage[],
    generationSettings?: GenerationSettings,
    customFile?: FileData | null,
  ) => Promise<string>;
}

export interface UseChatHistoryReturn {
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveChatToDatabase: (
    msgs: Message[],
    mode: GenerationMode,
    chatId: string | null,
  ) => Promise<string | null>;
  loadChatFromDatabase: (chatId: string) => Promise<LoadedChat | null>;
  deleteChat: (chatId: string, currentId: string | null) => Promise<boolean>;
  createNewChat: () => void;
}