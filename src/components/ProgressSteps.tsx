import React from "react";

interface StepProps {
  title: string;
  active: boolean;
  completed: boolean;
}

function Step({ title, active, completed }: StepProps) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center
        ${completed ? 'bg-black border-2 border-black' : active ? 'bg-white border-2 border-black' : 'bg-white border-2 border-gray-300'}`}
      >
        {completed && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <span className={`text-xs mt-2 ${active ? 'font-semibold text-black' : completed ? 'font-medium text-black' : 'text-gray-400'}`}>
        {title}
      </span>
    </div>
  );
}

export default function ProgressSteps() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="relative flex justify-between items-center px-8">
        <Step title="Reported" active={false} completed={true} />
        <Step title="Reviewing" active={false} completed={true} />
        <Step title="Action Needed" active={true} completed={false} />
        <Step title="Reviewing Response" active={false} completed={false} />
        <Step title="Closed" active={false} completed={false} />

        {/* Progress bar */}
        <div className="absolute top-3 left-0 w-full h-[2px] z-0">
          <div className="w-full flex">
            <div className="h-[2px] bg-black w-[37.5%]"></div>
            <div className="h-[2px] bg-gray-300 w-[62.5%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
