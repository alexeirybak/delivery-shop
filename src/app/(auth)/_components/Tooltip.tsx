import Image from "next/image";

const Tooltip = ({text}: {text: string}) => {
  return (
    <div className="absolute left-0 top-full mt-1 w-full transition-all duration-300 ease-in-out">
      <div className="relative bg-[#d80000] text-white text-sm p-2 rounded max-w-65 mx-auto flex items-center z-50 opacity-0 animate-fadeIn">
        <Image
          src="/icons-auth/icon-attention.svg"
          alt={text}
          width={21}
          height={21}
          className="mr-4"
        />
        <div
          className="absolute left-1/2 -top-0.75 transform -translate-x-1/2 w-0 h-0 
                     border-l-[6px] border-r-[6px] border-b-[4px] 
                     border-l-transparent border-r-transparent border-b-[#d80000]"
        ></div>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;