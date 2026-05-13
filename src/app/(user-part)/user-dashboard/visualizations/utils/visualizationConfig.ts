import {
  MindMapNode,
  FlowchartNode,
  NetworkGraph,
  ChartData,
  PieChartData,
  RadarChartData,
  LineChartData,
  ComparisonTableData,
  RoadmapData,
  HierarchyData,
  TimelineData,
  VisualizationType,
  VisualizationData,
  FlashcardData,
  GlossaryData,
  RoleplayScenario,
} from "../types/visualizations.types";

interface VisualizationConfig {
  type: VisualizationType;
  validate: (data: unknown) => boolean;
  getShortMessage: (data: VisualizationData, topic: string) => string;
  getDefaultMessage: (topic: string) => string;
}

export const visualizationConfigs: Record<string, VisualizationConfig> = {
  mindmap: {
    type: "mindmap",
    validate: (data): data is MindMapNode => {
      return data !== null && typeof data === "object" && "name" in data;
    },
    getShortMessage: (_, topic) => `Ментальная карта по теме "${topic}" готова`,
    getDefaultMessage: (topic) => `Ментальная карта по теме "${topic}" готова`,
  },
  flowchart: {
    type: "flowchart",
    validate: (data): data is FlowchartNode => {
      return (
        data !== null &&
        typeof data === "object" &&
        "id" in data &&
        "type" in data &&
        "label" in data
      );
    },
    getShortMessage: (_, topic) => `Блок-схема "${topic}" готова`,
    getDefaultMessage: () => "Блок-схема готова",
  },
  network: {
    type: "network",
    validate: (data): data is NetworkGraph => {
      return (
        data !== null &&
        typeof data === "object" &&
        "nodes" in data &&
        "edges" in data &&
        Array.isArray((data as NetworkGraph).nodes) &&
        Array.isArray((data as NetworkGraph).edges)
      );
    },
    getShortMessage: (data, topic) => {
      const nodeCount = (data as NetworkGraph).nodes.length;
      const edgeCount = (data as NetworkGraph).edges.length;
      return `Сетевой граф "${topic}" готов (${nodeCount} узлов, ${edgeCount} связей)`;
    },
    getDefaultMessage: (topic) => `Сетевой граф "${topic}" готов`,
  },
  barchart: {
    type: "barchart",
    validate: (data): data is ChartData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "labels" in data &&
        "datasets" in data &&
        Array.isArray((data as ChartData).labels) &&
        Array.isArray((data as ChartData).datasets)
      );
    },
    getShortMessage: (data, topic) => {
      const barCount = (data as ChartData).labels.length;
      const datasetCount = (data as ChartData).datasets.length;
      return `Столбчатая диаграмма "${topic}" готова (${barCount} столбцов, ${datasetCount} наборов данных)`;
    },
    getDefaultMessage: (topic) => `Столбчатая диаграмма "${topic}" готова`,
  },
  piechart: {
    type: "piechart",
    validate: (data): data is PieChartData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as PieChartData).data)
      );
    },
    getShortMessage: (data, topic) => {
      const sectorCount = (data as PieChartData).data.length;
      return `Круговая диаграмма "${topic}" готова (${sectorCount} секторов)`;
    },
    getDefaultMessage: (topic) => `Круговая диаграмма "${topic}" готова`,
  },
  radarchart: {
    type: "radarchart",
    validate: (data): data is RadarChartData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "labels" in data &&
        "datasets" in data &&
        Array.isArray((data as RadarChartData).labels) &&
        Array.isArray((data as RadarChartData).datasets)
      );
    },
    getShortMessage: (data, topic) => {
      const axesCount = (data as RadarChartData).labels.length;
      const datasetCount = (data as RadarChartData).datasets.length;
      return `Лепестковая диаграмма "${topic}" готова (${axesCount} осей, ${datasetCount} наборов данных)`;
    },
    getDefaultMessage: (topic) => `Лепестковая диаграмма "${topic}" готова`,
  },
  linechart: {
    type: "linechart",
    validate: (data): data is LineChartData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "labels" in data &&
        "datasets" in data &&
        Array.isArray((data as LineChartData).labels) &&
        Array.isArray((data as LineChartData).datasets)
      );
    },
    getShortMessage: (data, topic) => {
      const pointsCount = (data as LineChartData).labels.length;
      const datasetCount = (data as LineChartData).datasets.length;
      return `Линейный график "${topic}" готов (${pointsCount} точек, ${datasetCount} наборов данных)`;
    },
    getDefaultMessage: (topic) => `Линейный график "${topic}" готов`,
  },
  visualization_comparison: {
    type: "visualization_comparison",
    validate: (data): data is ComparisonTableData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "headers" in data &&
        "rows" in data &&
        Array.isArray((data as ComparisonTableData).headers) &&
        Array.isArray((data as ComparisonTableData).rows)
      );
    },
    getShortMessage: (data, topic) => {
      const rowsCount = (data as ComparisonTableData).rows.length;
      const colsCount = (data as ComparisonTableData).headers.length;
      return `Сравнительная таблица "${topic}" готова (${rowsCount} строк, ${colsCount} столбцов)`;
    },
    getDefaultMessage: (topic) => `Сравнительная таблица "${topic}" готова`,
  },
  roadmap: {
    type: "roadmap",
    validate: (data): data is RoadmapData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "phases" in data &&
        Array.isArray((data as RoadmapData).phases) &&
        (data as RoadmapData).phases.length > 0 &&
        (data as RoadmapData).phases.every(
          (phase) =>
            phase &&
            typeof phase === "object" &&
            "name" in phase &&
            "tasks" in phase &&
            Array.isArray(phase.tasks),
        )
      );
    },
    getShortMessage: (data, topic) => {
      const phasesCount = (data as RoadmapData).phases.length;
      const tasksCount = (data as RoadmapData).phases.reduce(
        (sum, phase) => sum + phase.tasks.length,
        0,
      );
      return `Дорожная карта "${topic}" готова (${phasesCount} этапов, ${tasksCount} задач)`;
    },
    getDefaultMessage: (topic) => `Дорожная карта "${topic}" готова`,
  },
  hierarchy: {
    type: "hierarchy",
    validate: (data): data is HierarchyData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "id" in data &&
        "name" in data &&
        ("children" in data
          ? Array.isArray((data as HierarchyData).children)
          : true)
      );
    },
    getShortMessage: (data, topic) => {
      const countNodes = (node: HierarchyData): number => {
        let count = 1;
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            count += countNodes(child);
          }
        }
        return count;
      };
      const nodesCount = countNodes(data as HierarchyData);
      return `Иерархическая схема "${topic}" готова (${nodesCount} узлов)`;
    },
    getDefaultMessage: (topic) => `Иерархическая схема "${topic}" готова`,
  },
  timeline: {
    type: "timeline",
    validate: (data): data is TimelineData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "events" in data &&
        Array.isArray((data as TimelineData).events) &&
        (data as TimelineData).events.length > 0 &&
        (data as TimelineData).events.every(
          (event) =>
            event &&
            typeof event === "object" &&
            "id" in event &&
            "date" in event &&
            "title" in event,
        )
      );
    },
    getShortMessage: (data, topic) => {
      const eventsCount = (data as TimelineData).events.length;
      const dates = (data as TimelineData).events;
      const firstDate = dates[0]?.date || "";
      const lastDate = dates[dates.length - 1]?.date || "";
      return `Хронология "${topic}" готова (${eventsCount} событий, ${firstDate} — ${lastDate})`;
    },
    getDefaultMessage: (topic) => `Хронология "${topic}" готова`,
  },
  flashcards: {
    type: "flashcards",
    validate: (data): data is FlashcardData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "name" in data &&
        "cards" in data &&
        Array.isArray((data as FlashcardData).cards) &&
        (data as FlashcardData).cards.length > 0 &&
        (data as FlashcardData).cards.every(
          (card) =>
            card &&
            typeof card === "object" &&
            "question" in card &&
            "answer" in card,
        )
      );
    },
    getShortMessage: (data, topic) => {
      const cardsCount = (data as FlashcardData).cards.length;
      const name = (data as FlashcardData).name || topic;
      return `Колода карточек "${name}" готова (${cardsCount} карточек)`;
    },
    getDefaultMessage: (topic) => `Колода карточек по теме "${topic}" готова`,
  },
  glossary: {
    type: "glossary",
    validate: (data): data is GlossaryData => {
      return (
        data !== null &&
        typeof data === "object" &&
        "title" in data &&
        "terms" in data &&
        Array.isArray((data as GlossaryData).terms) &&
        (data as GlossaryData).terms.length > 0 &&
        (data as GlossaryData).terms.every(
          (term) =>
            term &&
            typeof term === "object" &&
            "term" in term &&
            "definition" in term,
        )
      );
    },
    getShortMessage: (data, topic) => {
      const glossaryData = data as unknown as GlossaryData;
      const termsCount = glossaryData.terms.length;
      const title = glossaryData.title || topic;
      return `Глоссарий "${title}" готов (${termsCount} терминов)`;
    },
    getDefaultMessage: (topic) => `Глоссарий по теме "${topic}" готов`,
  },
  roleplay: {
    type: "roleplay",
    validate: (data): data is RoleplayScenario => {
      return (
        data !== null &&
        typeof data === "object" &&
        "title" in data &&
        "role" in data &&
        "situation" in data &&
        "choices" in data &&
        Array.isArray((data as RoleplayScenario).choices)
      );
    },
    getShortMessage: (data, topic) => {
      const scenario = data as unknown as RoleplayScenario;
      const title = scenario.title || topic;
      const choicesCount = scenario.choices?.length || 0;
      return `Ролевая игра "${title}" готова (${choicesCount} вариантов действий)`;
    },
    getDefaultMessage: (topic) => `Ролевая игра по теме "${topic}" готова`,
  },
};

