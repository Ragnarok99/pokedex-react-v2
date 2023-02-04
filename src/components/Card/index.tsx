import React from "react";

interface Props extends React.PropsWithChildren {}

export const Card = ({ children }: Props) => {
  return (
    <div className="bg-white relative min-w-[30px] min-h-[30px] p-4 shadow-sm rounded-2xl">
      {children}
    </div>
  );
};
