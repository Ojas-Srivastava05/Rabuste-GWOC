import { useEffect } from "react";
import initCoffeeParticles from "./coffeeParticles";

const CoffeeParticles: React.FC = () => {
  useEffect(() => {
    initCoffeeParticles();
  }, []);

  return <canvas id="coffeeParticles" className="particle-layer" />;
};

export default CoffeeParticles;
