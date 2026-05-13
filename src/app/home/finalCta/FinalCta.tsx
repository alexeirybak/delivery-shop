import Image from "next/image";
import "./finalCta.css";

const FinalCta = () => {
  return (
    <section
      className="cta-section reveal reveal-9"
      aria-label="Главный призыв к действию"
      data-scroll
    >
      <div className="section-heading">
        <p className="eyebrow">Рабочая тетрадь</p>
        <div className="section-blocks">
          <div className="section-block">
            <h2>
              Продолжайте работать со сгенерированным контентом прямо в
              текстовом редакторе<br/> (рабочей тетради) приложения
            </h2>
            <p>
              От первого запроса до готового текста лекции, учебника,
              научной статьи с возможностями улучшения текста с помощью ИИ,
              генерации изображений.
            </p>
          </div>
          <div className="section-image-block">
            <Image
              src="/images/editor.png"
              alt="Редактор"
              fill
              className="editor-image"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
