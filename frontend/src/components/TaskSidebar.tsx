import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { CheckCircle, ClipboardCheck, Clock, List, X } from "lucide-react";

interface TaskSidebarProps {
  selectedStatus: "To Do" | "Ongoing" | "Complete" | null;
  setSelectedStatus: (status: "To Do" | "Ongoing" | "Complete" | null) => void;
  isSidebarOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
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
}) => {
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    
    const handleResize = () => {
      if (isSidebarOpen && checkMobile()) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, onClose]);

  return (
    <>
      <div className="hidden md:block relative z-40 w-64 min-h-screen p-4 bg-gray-50 border-r border-gray-200">
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
              transition={{ duration: 0.3 }}
            />
            
            <motion.div
              className="fixed z-40 w-64 min-h-screen p-4 bg-gray-50 border-r border-gray-200 md:hidden"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
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
  <div className="space-y-6">
    <button
      onClick={onClose}
      className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full"
    >
      <X className="h-6 w-6 text-gray-600" />
    </button>

    <p className="font-bold flex justify-start pl-4 pt-5 pb-5 text-2xl rubik-glitch-regular">
      TaskFlow
    </p>

    <button
      onClick={() => setSelectedStatus(null)}
      className={clsx(
        "w-full px-4 py-2 text-left rounded-lg transition-colors",
        {
          "bg-gray-500 text-white hover:bg-gray-600": selectedStatus === null,
          "hover:bg-gray-200": selectedStatus !== null,
        }
      )}
    >
      <List className="inline-block mr-2" />
      All
    </button>

    <button
      onClick={() => setSelectedStatus(selectedStatus === "To Do" ? null : "To Do")}
      className={clsx(
        "w-full px-4 py-2 text-left rounded-lg transition-colors",
        {
          "bg-blue-500 text-white hover:bg-blue-600": selectedStatus === "To Do",
          "hover:bg-blue-200": selectedStatus !== "To Do",
        }
      )}
    >
      <ClipboardCheck className="inline-block mr-2" />
      To Do
    </button>

    <button
      onClick={() => setSelectedStatus(selectedStatus === "Ongoing" ? null : "Ongoing")}
      className={clsx(
        "w-full px-4 py-2 text-left rounded-lg transition-colors",
        {
          "bg-yellow-500 text-white hover:bg-yellow-600": selectedStatus === "Ongoing",
          "hover:bg-yellow-200": selectedStatus !== "Ongoing",
        }
      )}
    >
      <Clock className="inline-block mr-2" />
      Ongoing
    </button>

    <button
      onClick={() => setSelectedStatus(selectedStatus === "Complete" ? null : "Complete")}
      className={clsx(
        "w-full px-4 py-2 text-left rounded-lg transition-colors",
        {
          "bg-green-500 text-white hover:bg-green-600": selectedStatus === "Complete",
          "hover:bg-green-200": selectedStatus !== "Complete",
        }
      )}
    >
      <CheckCircle className="inline-block mr-2" />
      Complete
    </button>
  </div>
);

export default TaskSidebar;