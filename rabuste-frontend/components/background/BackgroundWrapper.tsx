import { ReactNode } from "react";
import GradientBG from "./Gradientbg";
import CoffeeParticles from "./CoffeeParticles";

interface BackgroundWrapperProps {
  children: ReactNode;
  showParticles?: boolean;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  showParticles = false,
}) => {
  return (
    <div className="relative min-h-screen">
      <GradientBG />
      {showParticles && <CoffeeParticles />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
