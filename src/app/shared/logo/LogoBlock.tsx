import Link from "next/link";
import LogoSvg from "./LogoSvg";
import "./logoBlock.css";

const LogoBlock = () => {
  return (
    <Link href="/" className="logo-link">
      <div className="logo-container">
        <div className="logo-icon">
          <LogoSvg />
        </div>
        <span className="logo-text">NeuroDidactica</span>
      </div>
    </Link>
  );
};

export default LogoBlock;
