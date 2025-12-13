import {DetailedHTMLProps, HTMLAttributes} from 'react';
import {cn} from "@maas/core-utils";

export function LayoutContent(props:  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return <div className={cn(
    "container flex self-stretch px-16 py-8 flex-col justify-start gap-8",
    props.className
  )
  }>{props.children}</div>;
}
