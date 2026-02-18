import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        void error;
        void errorInfo;
    }

    override render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                        <h2 className="text-xl font-semibold">Something went wrong</h2>
                        <p className="text-muted-foreground text-sm">An error occurred while loading this page.</p>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
                        >
                            Try again
                        </button>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
