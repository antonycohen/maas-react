import { useNavigate } from "react-router-dom";
import { CMSButtonBlock } from '@maas/core-api-models';


type ButtonBlockProps = {
  block: CMSButtonBlock;
  editMode?: boolean;
};

export function ButtonBlock(props: ButtonBlockProps) {
  const { block } = props;
  const { data } = block;
  const { redirectTo, label } = data;
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return <button onClick={() => handleClick(redirectTo)}>{label}</button>;
}
