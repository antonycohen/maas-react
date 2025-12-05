import { JSX } from "react/jsx-runtime";
import { CMSListBlock } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';

type ListBlockProps = {
  block: CMSListBlock;
  editMode?: boolean;
};

export function ListBlock(props: ListBlockProps) {
  const { block } = props;
  const { data } = block;
  const { date, content, type } = data;

  let listVariant = "ul";
  switch (type) {
    case "ordered":
      listVariant = "ol";
      break;
    case "unordered":
      listVariant = "ul";
      break;
    default:
      listVariant = "ul";
  }
  const List = listVariant as keyof JSX.IntrinsicElements;

  return (
    <div>
      {date && <h3 className="font-bricolage text-lg font-semibold text-neutral-900">{date}</h3>}

      <List
        className={cn("pl-4", {
          "list-disc": type === "unordered",
          "list-decimal": type === "ordered",
        })}
      >
        {content.map((listElement, index) => (
          <li key={index}>
            <span
              className="text-sm text-neutral-900"
              dangerouslySetInnerHTML={{ __html: listElement }}
            />
          </li>
        ))}
      </List>
    </div>
  );
}
