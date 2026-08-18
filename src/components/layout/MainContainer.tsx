import { ReactNode } from "react";

interface MainContainerProps {
  children: ReactNode;
  className?: string;
}

export function MainContainer({ children, className = "" }: MainContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
