import React from "react";

interface Props extends React.PropsWithChildren {
  onClick: () => void;
}

export const Card = ({ children, onClick, ...props }: Props) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className="bg-white relative min-w-[30px] min-h-[30px] p-4 shadow-sm rounded-2xl"
    >
      {children}
    </button>
  );
};
