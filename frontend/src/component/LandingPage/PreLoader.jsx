import React, { useEffect, useState } from "react";

const PreLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Hide preloader after completion
          return 100;
        }
        return oldProgress + 10;
      });
    }, 200); // Loading speed

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white z-50">
      <h1 className="text-4xl font-bold mb-4 animate-fade-in">Urban Cleaning</h1>
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PreLoader;
