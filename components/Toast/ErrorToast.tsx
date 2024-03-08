import { toast, type Toast } from "react-hot-toast";
import { useState } from "react";

import { AlertCircle as XCircleIcon } from "lucide-react";
import ProgressInterval from "./ProgressInterval";

type Props = {
  t: Toast;
  message: string;
};

const ErrorToast = ({ t, message }: Props) => {
  const [isPaused, setIsPaused] = useState(false);

  const leaveAnimDuration = 0.3 * 1000;
  const progressDuration = 5.6 * 1000;

  return (
    <div
      className={`${
        t.visible ? "opacity-100" : "opacity-0"
      } flex-col bg-zinc-700 border border-zinc-400 hover:border-red-500 shadow-lg rounded-lg transition animate-slide-in-left ease-out duration-300 group`}
      onMouseEnter={() => {
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
      <div className="flex items-center">
        <div className="py-4 pl-4">
          <XCircleIcon className="w-6 h-6 mr-3 -translate-y-[1px] inline text-red-400" />
        </div>
        <div className="py-4 pr-4">{message}</div>
        <div className="flex border-l border-zinc-500">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setTimeout(() => toast.remove(t.id), leaveAnimDuration);
            }}
            className="w-full border-l-[0.5px] group-hover:border-red-500 p-4 flex items-center justify-center text-sm font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
      <ProgressInterval duration={progressDuration} isPaused={isPaused} />
    </div>
  );
};

export function renderErrorToast(message: string) {
  const toastDuration = 6 * 1000;

  toast.custom((t) => <ErrorToast t={t} message={message} />, {
    duration: toastDuration,
    position: "bottom-right",
  });
}