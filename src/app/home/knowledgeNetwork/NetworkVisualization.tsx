import { networkLinks } from "@/utils/networkLinks";
import { networkNodes } from "@/utils/networkNode";
import "./knowledgeNetwork.css";

const NetworkVisualization = () => {
  const nodeMap = Object.fromEntries(
    networkNodes.map((node) => [node.id, node]),
  );
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1150 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="network-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(87, 241, 255, 0.05)" />
          <stop offset="45%" stopColor="rgba(87, 241, 255, 0.4)" />
          <stop offset="100%" stopColor="rgba(112, 77, 255, 0.12)" />
        </linearGradient>
        <radialGradient id="network-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="32%" stopColor="#57f1ff" />
          <stop offset="100%" stopColor="#704dff" />
        </radialGradient>
        <filter id="network-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="network-links">
        {networkLinks.map(([from, to], index) => {
          const start = nodeMap[from];
          const end = nodeMap[to];

          if (!start || !end) return null;

          return (
            <line
              key={`${from}-${to}`}
              className="network-link"
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              style={{ animationDelay: `${index * 0.09}s` }}
            />
          );
        })}
      </g>

      <g className="network-orbits">
        {networkNodes
          .filter((node) => node.size !== "sm")
          .map((node, index) => (
            <circle
              key={`${node.id}-orbit`}
              className="network-orbit"
              cx={node.x}
              cy={node.y}
              r={node.size === "lg" ? 18 : 12}
              style={{ animationDelay: `${index * 0.24}s` }}
            />
          ))}
      </g>

      <g className="network-pulses">
        {networkNodes
          .filter((node) => node.size === "lg")
          .map((node) => (
            <circle
              key={`${node.id}-pulse`}
              className="network-pulse"
              cx={node.x}
              cy={node.y}
              r="6"
              style={{ animationDelay: node.delay }}
            />
          ))}
      </g>

      <g filter="url(#network-glow)">
        {networkNodes.map((node) => (
          <g
            key={node.id}
            className={`network-node network-node-${node.size}`}
            style={{ animationDelay: node.delay }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r * 2.4}
              className="network-node-halo"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="url(#network-node)"
            />
          </g>
        ))}
      </g>
    </svg>
  );
};

export default NetworkVisualization;
