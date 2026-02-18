import React, { Component, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const DiffusionListsListPage = React.lazy(() => import('../pages/list-diffusion-lists-page/diffusion-lists-list-page'));
const DetailDiffusionListPage = React.lazy(
    () => import('../pages/detail-diffusion-list-page/detail-diffusion-list-page')
);

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    override state = { hasError: false, error: null as Error | null };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    override render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-destructive text-sm">{this.state.error?.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="text-primary mt-4 text-sm underline"
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export const DiffusionListsRoutes = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                <Routes>
                    <Route path="/" element={<DiffusionListsListPage />} />
                    <Route path=":diffusionListId" element={<DetailDiffusionListPage />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
};
