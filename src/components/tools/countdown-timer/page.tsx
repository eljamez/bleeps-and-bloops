"use client";

import { useCountdown } from "@/utils/useCountdown";
import clsx from "clsx";

export default function CountdownTimer() {
  const {
    initialTime,
    time,
    handleSetInitialTime,
    isRunning,
    handleToggleStartStop,
    handleReset,
    isCompleted,
  } = useCountdown();

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-900 to-pink-900 py-12">
      <div className="flex justify-between items-center gap-4">
        <input
          type="number"
          min={1}
          max={1000}
          className="w-full px-4 py-2 border border-gray-300 flex-1 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          value={initialTime}
          onChange={(e) => handleSetInitialTime(Number(e.target.value))}
          placeholder="Enter the number of seconds"
        />
        <button
          className={clsx(
            "px-4 py-2 text-white rounded-md flex-1 transition-colors",
            isRunning
              ? "bg-green-500 hover:bg-green-600"
              : "bg-primary hover:bg-primary-hover"
          )}
          onClick={handleToggleStartStop}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md flex-1 hover:bg-primary-hover transition-colors"
          onClick={() => handleReset()}
        >
          Reset
        </button>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-[8rem] font-bold text-center">{time}</p>
      </div>
      {isCompleted && (
        <div className="flex justify-center items-center">
          <button
            className="px-4 py-2 bg-primary text-white rounded-md flex-1 hover:bg-primary-hover transition-colors"
            onClick={() => handleReset()}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
