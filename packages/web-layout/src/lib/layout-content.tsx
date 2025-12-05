import { PropsWithChildren } from 'react';

export function LayoutContent(props: PropsWithChildren) {
  return <div className="flex flex-1 flex-col gap-4 p-4">{props.children}</div>;
}
