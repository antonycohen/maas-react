import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
} from '@maas/web-components';
import { Link } from 'react-router-dom';

type LayoutBreadcrumbProps = {
  items?: Array<{
    label: string;
    to?: string;
  }>;
}

export function LayoutBreadcrumb(props: LayoutBreadcrumbProps) {

  const { items = [] } = props;

  return <div className="border-border flex h-12 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:h-16">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    {items && items.length > 0 && (
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <div key={index} className="contents">
                <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild><Link to={item.to || '#'}>{item.label}</Link></BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )}
  </div>
}
