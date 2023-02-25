import React from "react";
import { motion, MotionProps } from "framer-motion";

interface Props extends React.PropsWithChildren<MotionProps> {
  onClick: () => void;
}

export const Card = ({ children, onClick, ...props }: Props) => {
  return (
    <motion.button
      {...props}
      onClick={onClick}
      className="bg-white h-full relative w-full p-4 shadow-sm rounded-2xl"
    >
      {children}
    </motion.button>
  );
};
