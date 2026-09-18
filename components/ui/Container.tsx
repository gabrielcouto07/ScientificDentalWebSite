import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
};

/** Contêiner da página: 1280 px, gutter 16 px no celular, 24/32 px acima. */
export function Container({ as: Tag = "div", className, children, id }: Props) {
  return (
    <Tag id={id} className={cn("mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
