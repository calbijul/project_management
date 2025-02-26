import React from "react";
import { Menu } from "lucide-react";

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden md:hidden p-2 text-black rounded-md fixed left-4 top-4 z-50"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
};

export default MenuButton;
