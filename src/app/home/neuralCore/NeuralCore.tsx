import Image from "next/image";
import "./neuralCore.css";

export const NeuralCore = () => {
  return (
    <section
      className="architecture reveal reveal-7"
      id="architecture"
      data-scroll
    >
      <div className="architecture-copy">
        <p className="eyebrow">Создание любых сетевых графов</p>
        <h2>
          Чем больше связей — тем глубже понимание. Так работает и мозг, и обучение
        </h2>
      </div>

      <div className="architecture-image-wrapper">
        <Image 
          src="/images/graph.png" 
          alt="Киберпанк образование будущего"
          width={400}
          height={300}
          className="architecture-image"
          priority
        />
      </div>
    </section>
  );
};