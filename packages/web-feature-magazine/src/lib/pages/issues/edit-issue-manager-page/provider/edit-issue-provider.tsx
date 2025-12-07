import { useEditIssueForm } from '../hooks/use-edit-issue-form';
import { useState } from 'react';

export const EditIssueProvider = (issueId: string) => {
  const { issue } = useEditIssueForm(issueId);
  const [selectedFolderId] = useState<string | null>(null);

  const getSelectedFolder = () => {
    if (!issue || !issue.folders || !selectedFolderId) return null;
    return issue.folders.find((folder) => folder.id === selectedFolderId);
  };

  return { issue, selectedFolderId, getSelectedFolder };
};
