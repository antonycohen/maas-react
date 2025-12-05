import { CMSTableBlock } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';

const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-full border border-neutral-800"
  >
    <path
      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
      fill="currentColor"
    />
  </svg>
);

type TableBlockProps = {
  block: CMSTableBlock;
  editMode?: boolean;
};

export function TableBlock(props: TableBlockProps) {
  const { block } = props;
  const { content, title } = block.data;

  return (
    <div className="rounded-lg border border-neutral-800 p-4">
      <table>
        <thead>
          <tr>
            <th>
              <h4 className="text-left font-bricolage text-lg font-semibold text-neutral-900">
                {title}
              </h4>
            </th>
            <th className="flex justify-end">
              <span className="cursor-pointer text-sm text-primary-500">
                En savoir plus
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {content.map((line, lineIndex) => (
            <tr key={lineIndex}>
              {line.map((row, rowIndex) => {
                const [isLeft, isRight] = [rowIndex === 0, rowIndex === 1];

                return (
                  <td key={rowIndex}>
                    <div
                      className={cn("flex items-center py-2", {
                        "justify-start gap-2": isLeft,
                        "justify-end": isRight,
                      })}
                    >
                      <span
                        className={cn("text-sm", {
                          "text-right font-semibold": isRight,
                        })}
                      >
                        {row}
                      </span>
                      {isLeft && <InfoIcon />}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
