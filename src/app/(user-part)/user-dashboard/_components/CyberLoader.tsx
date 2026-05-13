import '../styles/cyber-loader.css'

interface CyberLoaderProps {
  isVisible?: boolean;
}

export const CyberLoader = ({ isVisible }: CyberLoaderProps) => {
  if (!isVisible) return null;

  return (
    <div className="cyber-cube-loader">
      <div className="cyber-cube">
        <div className="cyber-cube-face front"></div>
        <div className="cyber-cube-face back"></div>
        <div className="cyber-cube-face right"></div>
        <div className="cyber-cube-face left"></div>
        <div className="cyber-cube-face top"></div>
        <div className="cyber-cube-face bottom"></div>
      </div>
    </div>
  );
};