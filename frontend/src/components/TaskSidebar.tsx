import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { CheckCircle, ClipboardCheck, Clock, List, X } from "lucide-react";

interface TaskSidebarProps {
  selectedStatus: "To Do" | "Ongoing" | "Complete" | null;
  setSelectedStatus: (status: "To Do" | "Ongoing" | "Complete" | null) => void;
  isSidebarOpen: boolean;
  onClose: () => void;
  className?: string;
}

const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(2.5px)' },
};

const sidebarVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const TaskSidebar: React.FC<TaskSidebarProps> = ({
  selectedStatus,
  setSelectedStatus,
  isSidebarOpen,
  onClose,
  className,
}) => {
  return (
    <>
      <div
        className={clsx(
          "hidden md:block fixed left-0 top-0 z-40 w-64 h-screen p-4 bg-gray-50 border-r border-gray-200",
          "transform transition-transform duration-300",
          className
        )}
      >
        <SidebarContent
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onClose={onClose}
        />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
              transition={{ duration: 0.2 }}
            />
            
            <motion.div
              className="fixed z-40 w-64 h-screen p-4 bg-gray-50 border-r border-gray-200 md:hidden"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: "tween", duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                onClose={onClose}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent: React.FC<Pick<TaskSidebarProps, 'selectedStatus' | 'setSelectedStatus' | 'onClose'>> = ({
  selectedStatus,
  setSelectedStatus,
  onClose,
}) => (
  <div className="relative h-full space-y-6">
    <button
      onClick={onClose}
      className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full"
    >
      <X className="h-6 w-6 text-gray-600" />
    </button>

    <p className="font-bold flex justify-start pl-4 pt-5 pb-5 text-2xl rubik-glitch-regular">
      TaskFlow
    </p>

    <div className="space-y-4">
      <button
        onClick={() => setSelectedStatus(null)}
        className={clsx(
          "w-full px-4 py-2 text-left rounded-lg transition-colors flex items-center border-2 border-transparent",
          {
            "bg-gray-500 text-white hover:bg-gray-600": selectedStatus === null,
            "hover:bg-gray-200 hover:border-gray-600 hover:text-gray-600": selectedStatus !== null,
          }
        )}
      >
        <List className="mr-2 h-5 w-5" />
        All Tasks
      </button>

      <button
        onClick={() => setSelectedStatus(selectedStatus === "To Do" ? null : "To Do")}
        className={clsx(
          "w-full px-4 py-2 text-left rounded-lg transition-colors flex items-center border-2 border-transparent",
          {
            "bg-blue-500 text-white hover:bg-blue-600": selectedStatus === "To Do",
            "hover:bg-blue-200 hover:border-blue-600 hover:text-blue-600": selectedStatus !== "To Do",
          }
        )}
      >
        <ClipboardCheck className="mr-2 h-5 w-5" />
        To Do
      </button>

      <button
        onClick={() => setSelectedStatus(selectedStatus === "Ongoing" ? null : "Ongoing")}
        className={clsx(
          "w-full px-4 py-2 text-left rounded-lg transition-colors flex items-center border-2 border-transparent",
          {
            "bg-yellow-500 text-white hover:bg-yellow-600": selectedStatus === "Ongoing",
            "hover:bg-yellow-200 hover:border-yellow-600 hover:text-yellow-600": selectedStatus !== "Ongoing",
          }
        )}
      >
        <Clock className="mr-2 h-5 w-5" />
        Ongoing
      </button>

      <button
        onClick={() => setSelectedStatus(selectedStatus === "Complete" ? null : "Complete")}
        className={clsx(
          "w-full px-4 py-2 text-left rounded-lg transition-colors flex items-center border-2 border-transparent",
          {
            "bg-green-500 text-white hover:bg-green-600": selectedStatus === "Complete",
            "hover:bg-green-200 hover:border-green-600 hover:text-green-600": selectedStatus !== "Complete",
          }
        )}
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        Complete
      </button>
    </div>
  </div>
);

export default TaskSidebar;