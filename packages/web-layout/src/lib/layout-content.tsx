import {DetailedHTMLProps, HTMLAttributes} from 'react';
import {cn} from "@maas/core-utils";

export function LayoutContent(props:  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return <div className={cn(
    "container mx-auto flex self-stretch py-10 flex-col justify-start gap-8 px-4",
    props.className
  )
  }>{props.children}</div>;
}
