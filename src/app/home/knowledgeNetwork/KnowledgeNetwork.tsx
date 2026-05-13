import NetworkVisualization from "./NetworkVisualization";
import "./knowledgeNetwork.css";

export const KnowledgeNetwork = () => {
  return (
    <div className="relative z-2">
      <div className="bg-layer">
        <NetworkVisualization />
      </div>
    </div>
  );
};
