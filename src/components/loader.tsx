import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="z-[999] fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 ">
      <div className="flex flex-col items-center">
        <div className="loader animate-spin border-t-4 border-b-4 border-blue-500 rounded-full w-16 h-16 mb-4"></div>
        <h2 className="text-lg font-semibold text-blue-600">Loading.....</h2>
      </div>
    </div>
  );
};

export default Loader;
