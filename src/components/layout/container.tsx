import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`w-full px-6 sm:px-8 ${className}`}
      {...props}
    />
  );
}
