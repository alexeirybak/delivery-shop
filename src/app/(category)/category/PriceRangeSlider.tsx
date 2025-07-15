import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { PriceRangeSliderProps } from "@/types/priceRangeSliderProps";

const PriceRangeSlider = ({
  min,
  max,
  values,
  onChangeAction,
}: PriceRangeSliderProps) => {
  return (
    <div className="w-[320px] xl:w-[272px] px-2 mx-auto">
      <Slider
        range
        min={min}
        max={max}
        value={values}
        onChange={(v) =>
          Array.isArray(v) && onChangeAction(v as [number, number])
        }
        styles={{
          track: {
            backgroundColor: "#70c05b",
            height: 4,
          },
          handle: {
            width: 20,
            height: 20,
            backgroundColor: "#70c05b",
            border: "1px solid #ffffff",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            marginTop: -8,
            cursor: "pointer",
            opacity: 1,
          },
          rail: {
            backgroundColor: "#f0f0f0",
            height: 4,
          },
        }}
      />
    </div>
  );
};

export default PriceRangeSlider;
