export const buttonStyles = {
  base: "w-65 h-17 my-10 mx-auto text-2xl rounded cursor-pointer duration-300",
  active:
    "bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) flex items-center justify-center rounded cursor-pointer duration-300",
  inactive: "bg-[#fcd5ba] text-[#ff6633] rounded",
};

export const formStyles = {
  label: "text-base text-[#8f8f8f] block",
  input:
    "w-65 h-10 py-2 px-4 text-main-text text-base border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:bg-white focus:outline-none caret-primary",
  loginLink:
    "mb-10 mx-auto h-8 text-primary hover:text-white active:text-white border-1 border-primary bg-white hover:bg-primary active:shadow-(--shadow-button-default) w-30 rounded flex items-center justify-center duration-300",
  radioLabel: "px-4 py-2 border rounded-lg cursor-pointer transition-colors",
  radioLabelActive: "bg-blue-500 text-white border-blue-500",
};

export const verificationButtonStyles = `
    w-60 md:w-80 group relative flex flex-col items-center justify-center p-3 
    border-2 border-gray-200 rounded-xl hover:border-[#ff6633] 
    hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) 
    cursor-pointer duration-300
  `;

export const iconContainerStyles = `
    p-3 mb-4 rounded-full bg-[#FFF2ED] 
    group-hover:bg-[#ff6633] duration-300
  `;

export const profileStyles = {
  editButton: `${buttonStyles.active} [&&]:w-full [&&]:md:w-auto px-4 py-2 rounded items-center justify-center font-medium duration-300 cursor-pointer flex flex-row gap-x-3`,
  cancelButton:
    "px-4 py-2 md:flex-none flex-1 bg-[#f3f2f1] rounded hover:shadow-button-secondary active:shadow-(--shadow-button-active) text-[#606060] duration-300 cursor-pointer",
  saveButton:
    "px-4 py-2 md:flex-none flex-1 bg-primary hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) rounded text-white duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
  sectionTitle: "text-lg font-semibold text-main-text w-20",
  inputContainer: "relative",
};
