import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    /** Called when the user clicks "Try again". Use to reset external state (e.g., navigate). */
    onReset?: () => void;
    /** Custom title for the default fallback. */
    title?: string;
    /** Custom message for the default fallback. */
    message?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
    };

    override render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
                        <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
                            <AlertCircle className="text-destructive h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold">{this.props.title ?? 'Something went wrong'}</h2>
                            <p className="text-muted-foreground max-w-md text-sm">
                                {this.props.message ??
                                    'An unexpected error occurred. Please try again or refresh the page.'}
                            </p>
                        </div>
                        <button
                            onClick={this.handleReset}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try again
                        </button>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
