import { formStyles } from "@/app/styles";
import { cities } from "@/data/cities";
import { additionalStyles, labelStyles, selectStyles } from "./styles";
import { DeliveryAddress as DeliveryAddressType } from "@/types/order";

interface DeliveryAddressProps {
  formData: DeliveryAddressType;
  onFormDataChange: (field: keyof DeliveryAddressType, value: string) => void;
}

const DeliveryAddress = ({
  formData,
  onFormDataChange,
}: DeliveryAddressProps) => {
  return (
    <>
      <h2 className="text-2xl xl:text-4xl font-bold mb-6">Куда</h2>
      <div className="flex flex-col gap-y-4 xl:flex-row xl:flex-nowrap md:gap-x-8 xl:gap-x-10">
        <div className="flex flex-col gap-y-4 md:flex-row md:w-full md:justify-between md:gap-x-8">
          <div className="md:flex-1">
            <label className={labelStyles}>Населенный пункт *</label>
            <select
              value={formData.city}
              onChange={(e) => onFormDataChange("city", e.target.value)}
              className={`${formStyles.input} ${additionalStyles} ${selectStyles}`}
              required
            >
              {cities.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:flex-1">
            <label className={labelStyles}>Улица</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => onFormDataChange("street", e.target.value)}
              className={`${formStyles.input} ${additionalStyles}`}
              required
            />
          </div>
        </div>

        <div className="flex flex-row gap-x-4 md:gap-x-8 xl:gap-x-10">
          <div className="flex-1">
            <label className={labelStyles}>Дом</label>
            <input
              type="text"
              value={formData.house}
              onChange={(e) => onFormDataChange("house", e.target.value)}
              className={`${formStyles.input} ${additionalStyles} [&&]:min-w-[67px]`}
              required
            />
          </div>

          <div className="flex-1">
            <label className={labelStyles}>Квартира</label>
            <input
              type="text"
              value={formData.apartment}
              onChange={(e) => onFormDataChange("apartment", e.target.value)}
              className={`${formStyles.input} ${additionalStyles}`}
            />
          </div>

          <div className="flex-1">
            <label className={labelStyles}>Дополнительно</label>
            <input
              value={formData.additional}
              onChange={(e) => onFormDataChange("additional", e.target.value)}
              className={`${formStyles.input} ${additionalStyles}`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryAddress;
