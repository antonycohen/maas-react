import { useCallback, useState } from 'react';
import { CreateFolder, ReadFolderRef } from '@maas/core-api-models';

type UseAddFolderModalParams = {
  onLinkExisting: (folder: ReadFolderRef) => void;
  onCreate: (data: CreateFolder) => void;
};

export const useAddFolderModal = ({
  onLinkExisting,
  onCreate,
}: UseAddFolderModalParams) => {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectExisting = useCallback(
    (folder: ReadFolderRef) => {
      onLinkExisting(folder);
      closeModal();
    },
    [onLinkExisting, closeModal],
  );

  const handleCreate = useCallback(
    (data: CreateFolder) => {
      onCreate(data);
      closeModal();
    },
    [onCreate, closeModal],
  );

  return {
    open,
    setOpen,
    openModal,
    closeModal,
    handleSelectExisting,
    handleCreate,
  };
};
