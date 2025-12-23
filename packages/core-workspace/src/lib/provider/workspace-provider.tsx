import React, { PropsWithChildren } from 'react';

type UserOrganizationsProviderType = {
  selectedWorkspaceId: string | null;
  getCurrentWorkspaceUrlPrefix: () => string;
};

export const WorkspaceContext =
  React.createContext<UserOrganizationsProviderType>({
    selectedWorkspaceId: null,
    getCurrentWorkspaceUrlPrefix: () => {
      return '/w';
    },
  });

type WorkspaceProviderProps = PropsWithChildren<{
  selectedWorkspaceId: string | null;
}>;

export const WorkspaceProvider = (props: WorkspaceProviderProps) => {
  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspaceId: props.selectedWorkspaceId,
        getCurrentWorkspaceUrlPrefix: () => {
          return `/admin/w/${props.selectedWorkspaceId ?? ''}`;
        },
      }}
    >
      {props.children}
    </WorkspaceContext.Provider>
  );
};

export const useCurrentWorkspaceUrlPrefix = () => {
  return React.useContext(WorkspaceContext).getCurrentWorkspaceUrlPrefix();
};

export const useGetCurrentWorkspaceId = () => {
  return React.useContext(WorkspaceContext).selectedWorkspaceId;
};
