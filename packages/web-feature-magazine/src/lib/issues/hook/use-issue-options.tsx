import { useGetIssues } from "@maas/core-api";

export const useIssueOptions = () => {
    const { data } = useGetIssues({
        offset: 0,
        limit: 50,
        fields: {
            id: null,
            title: null,
        }
    });
    return (
        data?.data.map((issue) => ({ value: issue.id, label: issue.title })) || []
    );
}