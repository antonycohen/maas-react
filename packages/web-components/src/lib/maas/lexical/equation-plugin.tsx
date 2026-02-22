'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    $insertNodes,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    LexicalCommand,
} from 'lexical';
import { $createEquationNode, EquationNode } from './equation-node';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Sigma } from 'lucide-react';
import * as katex from 'katex';
import { cn } from '@maas/core-utils';

// LaTeX commands with example values for preview
const LATEX_COMMANDS: { command: string; example: string; description: string }[] = [
    // Greek letters - lowercase
    { command: '\\alpha', example: '\\alpha', description: 'Greek alpha' },
    { command: '\\beta', example: '\\beta', description: 'Greek beta' },
    { command: '\\gamma', example: '\\gamma', description: 'Greek gamma' },
    { command: '\\delta', example: '\\delta', description: 'Greek delta' },
    { command: '\\epsilon', example: '\\epsilon', description: 'Greek epsilon' },
    { command: '\\varepsilon', example: '\\varepsilon', description: 'Greek varepsilon' },
    { command: '\\zeta', example: '\\zeta', description: 'Greek zeta' },
    { command: '\\eta', example: '\\eta', description: 'Greek eta' },
    { command: '\\theta', example: '\\theta', description: 'Greek theta' },
    { command: '\\vartheta', example: '\\vartheta', description: 'Greek vartheta' },
    { command: '\\iota', example: '\\iota', description: 'Greek iota' },
    { command: '\\kappa', example: '\\kappa', description: 'Greek kappa' },
    { command: '\\lambda', example: '\\lambda', description: 'Greek lambda' },
    { command: '\\mu', example: '\\mu', description: 'Greek mu' },
    { command: '\\nu', example: '\\nu', description: 'Greek nu' },
    { command: '\\xi', example: '\\xi', description: 'Greek xi' },
    { command: '\\pi', example: '\\pi', description: 'Greek pi' },
    { command: '\\varpi', example: '\\varpi', description: 'Greek varpi' },
    { command: '\\rho', example: '\\rho', description: 'Greek rho' },
    { command: '\\varrho', example: '\\varrho', description: 'Greek varrho' },
    { command: '\\sigma', example: '\\sigma', description: 'Greek sigma' },
    { command: '\\varsigma', example: '\\varsigma', description: 'Greek varsigma' },
    { command: '\\tau', example: '\\tau', description: 'Greek tau' },
    { command: '\\upsilon', example: '\\upsilon', description: 'Greek upsilon' },
    { command: '\\phi', example: '\\phi', description: 'Greek phi' },
    { command: '\\varphi', example: '\\varphi', description: 'Greek varphi' },
    { command: '\\chi', example: '\\chi', description: 'Greek chi' },
    { command: '\\psi', example: '\\psi', description: 'Greek psi' },
    { command: '\\omega', example: '\\omega', description: 'Greek omega' },
    // Greek letters - uppercase
    { command: '\\Gamma', example: '\\Gamma', description: 'Greek Gamma' },
    { command: '\\Delta', example: '\\Delta', description: 'Greek Delta' },
    { command: '\\Theta', example: '\\Theta', description: 'Greek Theta' },
    { command: '\\Lambda', example: '\\Lambda', description: 'Greek Lambda' },
    { command: '\\Xi', example: '\\Xi', description: 'Greek Xi' },
    { command: '\\Pi', example: '\\Pi', description: 'Greek Pi' },
    { command: '\\Sigma', example: '\\Sigma', description: 'Greek Sigma' },
    { command: '\\Upsilon', example: '\\Upsilon', description: 'Greek Upsilon' },
    { command: '\\Phi', example: '\\Phi', description: 'Greek Phi' },
    { command: '\\Psi', example: '\\Psi', description: 'Greek Psi' },
    { command: '\\Omega', example: '\\Omega', description: 'Greek Omega' },
    // Fractions and roots
    { command: '\\frac', example: '\\frac{a}{b}', description: 'Fraction' },
    { command: '\\dfrac', example: '\\dfrac{a}{b}', description: 'Display fraction' },
    { command: '\\tfrac', example: '\\tfrac{a}{b}', description: 'Text fraction' },
    { command: '\\sqrt', example: '\\sqrt{x}', description: 'Square root' },
    { command: '\\sqrt[n]', example: '\\sqrt[3]{x}', description: 'Nth root' },
    // Sums, products, integrals
    { command: '\\sum', example: '\\sum_{i=1}^{n} x_i', description: 'Summation' },
    { command: '\\prod', example: '\\prod_{i=1}^{n} x_i', description: 'Product' },
    { command: '\\int', example: '\\int_0^\\infty f(x)\\,dx', description: 'Integral' },
    { command: '\\iint', example: '\\iint_D f\\,dA', description: 'Double integral' },
    { command: '\\iiint', example: '\\iiint_V f\\,dV', description: 'Triple integral' },
    { command: '\\oint', example: '\\oint_C f\\,ds', description: 'Contour integral' },
    // Limits and calculus
    { command: '\\lim', example: '\\lim_{x \\to \\infty} f(x)', description: 'Limit' },
    { command: '\\limsup', example: '\\limsup_{n} a_n', description: 'Limit superior' },
    { command: '\\liminf', example: '\\liminf_{n} a_n', description: 'Limit inferior' },
    { command: '\\partial', example: '\\frac{\\partial f}{\\partial x}', description: 'Partial derivative' },
    { command: '\\nabla', example: '\\nabla f', description: 'Nabla/gradient' },
    // Relations
    { command: '\\leq', example: 'a \\leq b', description: 'Less than or equal' },
    { command: '\\geq', example: 'a \\geq b', description: 'Greater than or equal' },
    { command: '\\neq', example: 'a \\neq b', description: 'Not equal' },
    { command: '\\approx', example: 'a \\approx b', description: 'Approximately' },
    { command: '\\equiv', example: 'a \\equiv b', description: 'Equivalent' },
    { command: '\\sim', example: 'a \\sim b', description: 'Similar' },
    { command: '\\propto', example: 'a \\propto b', description: 'Proportional' },
    { command: '\\subset', example: 'A \\subset B', description: 'Subset' },
    { command: '\\subseteq', example: 'A \\subseteq B', description: 'Subset or equal' },
    { command: '\\supset', example: 'A \\supset B', description: 'Superset' },
    { command: '\\supseteq', example: 'A \\supseteq B', description: 'Superset or equal' },
    { command: '\\in', example: 'x \\in A', description: 'Element of' },
    { command: '\\notin', example: 'x \\notin A', description: 'Not element of' },
    { command: '\\ni', example: 'A \\ni x', description: 'Contains' },
    // Operations
    { command: '\\times', example: 'a \\times b', description: 'Times' },
    { command: '\\div', example: 'a \\div b', description: 'Division' },
    { command: '\\cdot', example: 'a \\cdot b', description: 'Dot product' },
    { command: '\\pm', example: 'a \\pm b', description: 'Plus minus' },
    { command: '\\mp', example: 'a \\mp b', description: 'Minus plus' },
    { command: '\\cup', example: 'A \\cup B', description: 'Union' },
    { command: '\\cap', example: 'A \\cap B', description: 'Intersection' },
    { command: '\\setminus', example: 'A \\setminus B', description: 'Set minus' },
    { command: '\\oplus', example: 'a \\oplus b', description: 'Direct sum' },
    { command: '\\otimes', example: 'a \\otimes b', description: 'Tensor product' },
    // Arrows
    { command: '\\rightarrow', example: 'a \\rightarrow b', description: 'Right arrow' },
    { command: '\\leftarrow', example: 'a \\leftarrow b', description: 'Left arrow' },
    { command: '\\leftrightarrow', example: 'a \\leftrightarrow b', description: 'Left-right arrow' },
    { command: '\\Rightarrow', example: 'a \\Rightarrow b', description: 'Double right arrow' },
    { command: '\\Leftarrow', example: 'a \\Leftarrow b', description: 'Double left arrow' },
    { command: '\\Leftrightarrow', example: 'a \\Leftrightarrow b', description: 'Double left-right arrow' },
    { command: '\\mapsto', example: 'x \\mapsto f(x)', description: 'Maps to' },
    { command: '\\to', example: 'x \\to \\infty', description: 'To' },
    // Brackets and delimiters
    { command: '\\left(', example: '\\left( \\frac{a}{b} \\right)', description: 'Left parenthesis' },
    { command: '\\right)', example: '\\left( x \\right)', description: 'Right parenthesis' },
    { command: '\\left[', example: '\\left[ x \\right]', description: 'Left bracket' },
    { command: '\\right]', example: '\\left[ x \\right]', description: 'Right bracket' },
    { command: '\\left\\{', example: '\\left\\{ x \\right\\}', description: 'Left brace' },
    { command: '\\right\\}', example: '\\left\\{ x \\right\\}', description: 'Right brace' },
    { command: '\\langle', example: '\\langle x, y \\rangle', description: 'Left angle' },
    { command: '\\rangle', example: '\\langle x \\rangle', description: 'Right angle' },
    { command: '\\lfloor', example: '\\lfloor x \\rfloor', description: 'Left floor' },
    { command: '\\rfloor', example: '\\lfloor x \\rfloor', description: 'Right floor' },
    { command: '\\lceil', example: '\\lceil x \\rceil', description: 'Left ceiling' },
    { command: '\\rceil', example: '\\lceil x \\rceil', description: 'Right ceiling' },
    // Accents and decorations
    { command: '\\hat', example: '\\hat{x}', description: 'Hat accent' },
    { command: '\\bar', example: '\\bar{x}', description: 'Bar accent' },
    { command: '\\vec', example: '\\vec{v}', description: 'Vector arrow' },
    { command: '\\dot', example: '\\dot{x}', description: 'Dot accent' },
    { command: '\\ddot', example: '\\ddot{x}', description: 'Double dot' },
    { command: '\\tilde', example: '\\tilde{x}', description: 'Tilde accent' },
    { command: '\\overline', example: '\\overline{AB}', description: 'Overline' },
    { command: '\\underline', example: '\\underline{x}', description: 'Underline' },
    { command: '\\overbrace', example: '\\overbrace{a+b}^{n}', description: 'Overbrace' },
    { command: '\\underbrace', example: '\\underbrace{a+b}_{n}', description: 'Underbrace' },
    // Matrices
    { command: '\\begin{matrix}', example: '\\begin{matrix} a & b \\\\ c & d \\end{matrix}', description: 'Matrix' },
    {
        command: '\\begin{pmatrix}',
        example: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
        description: 'Parenthesis matrix',
    },
    {
        command: '\\begin{bmatrix}',
        example: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
        description: 'Bracket matrix',
    },
    {
        command: '\\begin{vmatrix}',
        example: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}',
        description: 'Determinant',
    },
    // Functions
    { command: '\\sin', example: '\\sin(x)', description: 'Sine' },
    { command: '\\cos', example: '\\cos(x)', description: 'Cosine' },
    { command: '\\tan', example: '\\tan(x)', description: 'Tangent' },
    { command: '\\cot', example: '\\cot(x)', description: 'Cotangent' },
    { command: '\\sec', example: '\\sec(x)', description: 'Secant' },
    { command: '\\csc', example: '\\csc(x)', description: 'Cosecant' },
    { command: '\\arcsin', example: '\\arcsin(x)', description: 'Arc sine' },
    { command: '\\arccos', example: '\\arccos(x)', description: 'Arc cosine' },
    { command: '\\arctan', example: '\\arctan(x)', description: 'Arc tangent' },
    { command: '\\sinh', example: '\\sinh(x)', description: 'Hyperbolic sine' },
    { command: '\\cosh', example: '\\cosh(x)', description: 'Hyperbolic cosine' },
    { command: '\\tanh', example: '\\tanh(x)', description: 'Hyperbolic tangent' },
    { command: '\\log', example: '\\log(x)', description: 'Logarithm' },
    { command: '\\ln', example: '\\ln(x)', description: 'Natural log' },
    { command: '\\exp', example: '\\exp(x)', description: 'Exponential' },
    { command: '\\min', example: '\\min(a, b)', description: 'Minimum' },
    { command: '\\max', example: '\\max(a, b)', description: 'Maximum' },
    { command: '\\det', example: '\\det(A)', description: 'Determinant' },
    { command: '\\dim', example: '\\dim(V)', description: 'Dimension' },
    { command: '\\ker', example: '\\ker(f)', description: 'Kernel' },
    { command: '\\arg', example: '\\arg(z)', description: 'Argument' },
    // Special symbols
    { command: '\\infty', example: '\\infty', description: 'Infinity' },
    { command: '\\forall', example: '\\forall x', description: 'For all' },
    { command: '\\exists', example: '\\exists x', description: 'Exists' },
    { command: '\\nexists', example: '\\nexists x', description: 'Not exists' },
    { command: '\\emptyset', example: '\\emptyset', description: 'Empty set' },
    { command: '\\varnothing', example: '\\varnothing', description: 'Empty set (variant)' },
    { command: '\\neg', example: '\\neg p', description: 'Negation' },
    { command: '\\land', example: 'p \\land q', description: 'Logical and' },
    { command: '\\lor', example: 'p \\lor q', description: 'Logical or' },
    { command: '\\therefore', example: '\\therefore', description: 'Therefore' },
    { command: '\\because', example: '\\because', description: 'Because' },
    { command: '\\angle', example: '\\angle ABC', description: 'Angle' },
    { command: '\\perp', example: 'a \\perp b', description: 'Perpendicular' },
    { command: '\\parallel', example: 'a \\parallel b', description: 'Parallel' },
    { command: '\\cdots', example: '1, 2, \\cdots, n', description: 'Centered dots' },
    { command: '\\ldots', example: '1, 2, \\ldots, n', description: 'Lower dots' },
    { command: '\\vdots', example: '\\vdots', description: 'Vertical dots' },
    { command: '\\ddots', example: '\\ddots', description: 'Diagonal dots' },
    // Spacing
    { command: '\\quad', example: 'a \\quad b', description: 'Quad space' },
    { command: '\\qquad', example: 'a \\qquad b', description: 'Double quad space' },
    // Text
    { command: '\\text', example: '\\text{where } x > 0', description: 'Text in math' },
    { command: '\\textbf', example: '\\textbf{bold}', description: 'Bold text' },
    { command: '\\textit', example: '\\textit{italic}', description: 'Italic text' },
    { command: '\\mathbf', example: '\\mathbf{v}', description: 'Bold math' },
    { command: '\\mathit', example: '\\mathit{x}', description: 'Italic math' },
    { command: '\\mathcal', example: '\\mathcal{L}', description: 'Calligraphic' },
    { command: '\\mathbb', example: '\\mathbb{R}', description: 'Blackboard bold' },
    { command: '\\mathfrak', example: '\\mathfrak{g}', description: 'Fraktur' },
];

export const INSERT_EQUATION_COMMAND: LexicalCommand<{
    equation: string;
    inline: boolean;
}> = createCommand('INSERT_EQUATION_COMMAND');

type EquationPluginProps = {
    onOpenChange?: (open: boolean) => void;
};

export function EquationPlugin({ onOpenChange }: EquationPluginProps) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([EquationNode])) {
            throw new Error('EquationPlugin: EquationNode not registered in editor');
        }

        return editor.registerCommand(
            INSERT_EQUATION_COMMAND,
            (payload) => {
                const { equation, inline } = payload;
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    const equationNode = $createEquationNode(equation, inline);
                    $insertNodes([equationNode]);
                }

                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    useEffect(() => {
        onOpenChange?.(false);
    }, [onOpenChange]);

    return null;
}

// Autocomplete suggestion item
type SuggestionItemProps = {
    command: string;
    example: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
};

function SuggestionItem({ command, example, description, isSelected, onClick }: SuggestionItemProps) {
    const previewHtml = useMemo(() => {
        try {
            return katex.renderToString(example, {
                displayMode: false,
                output: 'html',
                throwOnError: false,
            });
        } catch {
            return '';
        }
    }, [example]);

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors',
                isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
        >
            <div className="flex min-w-0 flex-col gap-0.5">
                <code className={cn('font-mono text-xs', isSelected ? 'text-primary-foreground' : 'text-foreground')}>
                    {command}
                </code>
                <span
                    className={cn(
                        'truncate text-xs',
                        isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}
                >
                    {description}
                </span>
            </div>
            <div
                className={cn('shrink-0 text-base', isSelected ? 'text-primary-foreground' : 'text-foreground')}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
        </button>
    );
}

type EquationDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EquationDialog({ open, onOpenChange }: EquationDialogProps) {
    const [editor] = useLexicalComposerContext();
    const [equation, setEquation] = useState('');
    const [inline, setInline] = useState(true);
    const { preview, error } = useMemo(() => {
        if (!equation) return { preview: '', error: null };
        try {
            const html = katex.renderToString(equation, {
                displayMode: !inline,
                output: 'htmlAndMathml',
                throwOnError: true,
            });
            return { preview: html, error: null };
        } catch (e) {
            return { preview: '', error: e instanceof Error ? e.message : 'Invalid equation' };
        }
    }, [equation, inline]);

    // Autocomplete state
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [autocompleteQuery, setAutocompleteQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const autocompleteRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on query
    const filteredSuggestions = useMemo(() => {
        if (!autocompleteQuery) return [];
        const query = autocompleteQuery.toLowerCase();
        return LATEX_COMMANDS.filter((cmd) => cmd.command.toLowerCase().startsWith(query)).slice(0, 10); // Limit to 10 suggestions
    }, [autocompleteQuery]);

    // Reset selected index when autocomplete query changes
    useEffect(() => {
         
        setSelectedIndex(0);
    }, [autocompleteQuery]);

    // Scroll selected item into view
    useEffect(() => {
        if (autocompleteRef.current && showAutocomplete) {
            const selectedEl = autocompleteRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            selectedEl?.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex, showAutocomplete]);

    // Handle input change with autocomplete detection
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const cursor = e.target.selectionStart ?? 0;
        setEquation(value);
        setCursorPosition(cursor);

        // Find if we're typing a command (backslash followed by letters)
        const textBeforeCursor = value.slice(0, cursor);
        const match = textBeforeCursor.match(/\\([a-zA-Z]*)$/);

        if (match) {
            setAutocompleteQuery('\\' + match[1]);
            setShowAutocomplete(true);
        } else {
            setShowAutocomplete(false);
            setAutocompleteQuery('');
        }
    }, []);

    // Insert selected suggestion (uses the full example)
    const insertSuggestion = useCallback(
        (suggestion: (typeof LATEX_COMMANDS)[0]) => {
            const textBeforeCursor = equation.slice(0, cursorPosition);
            const textAfterCursor = equation.slice(cursorPosition);

            // Find the start of the current command
            const match = textBeforeCursor.match(/\\[a-zA-Z]*$/);
            if (match) {
                const commandStart = textBeforeCursor.length - match[0].length;
                // Insert the full example instead of just the command
                const newText = textBeforeCursor.slice(0, commandStart) + suggestion.example + textAfterCursor;
                setEquation(newText);

                // Move cursor to end of inserted example
                const newCursor = commandStart + suggestion.example.length;
                setCursorPosition(newCursor);

                // Focus and set cursor position
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.focus();
                        textareaRef.current.setSelectionRange(newCursor, newCursor);
                    }
                }, 0);
            }

            setShowAutocomplete(false);
            setAutocompleteQuery('');
        },
        [equation, cursorPosition]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (showAutocomplete && filteredSuggestions.length > 0) {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
                        break;
                    case 'Enter':
                        e.preventDefault();
                        insertSuggestion(filteredSuggestions[selectedIndex]);
                        break;
                    case 'Escape':
                        e.preventDefault();
                        setShowAutocomplete(false);
                        break;
                    case 'Tab':
                        e.preventDefault();
                        insertSuggestion(filteredSuggestions[selectedIndex]);
                        break;
                }
            }
        },
        [showAutocomplete, filteredSuggestions, selectedIndex, insertSuggestion]
    );

    const handleInsert = useCallback(() => {
        if (!equation || error) return;

        editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline });
        setEquation('');
        onOpenChange(false);
    }, [editor, equation, inline, error, onOpenChange]);

    const handleClose = useCallback(() => {
        setEquation('');
        setShowAutocomplete(false);
        onOpenChange(false);
    }, [onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Insert Equation</DialogTitle>
                    <DialogDescription>
                        Enter a LaTeX equation. Type <code className="bg-muted rounded px-1">\</code> to see available
                        commands.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="equation-type"
                                checked={inline}
                                onChange={() => setInline(true)}
                                className="accent-primary"
                            />
                            <span className="text-sm">Inline</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="equation-type"
                                checked={!inline}
                                onChange={() => setInline(false)}
                                className="accent-primary"
                            />
                            <span className="text-sm">Block</span>
                        </label>
                    </div>

                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={equation}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="bg-muted text-foreground placeholder:text-muted-foreground min-h-[80px] w-full rounded-md border p-3 font-mono text-sm outline-none focus:ring-2"
                            placeholder="e.g., E = mc^2, \frac{a}{b}, \sum_{i=1}^{n} x_i"
                        />

                        {/* Autocomplete dropdown */}
                        {showAutocomplete && filteredSuggestions.length > 0 && (
                            <div
                                ref={autocompleteRef}
                                className="bg-popover absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border shadow-lg"
                            >
                                {filteredSuggestions.map((suggestion, index) => (
                                    <div key={suggestion.command} data-index={index}>
                                        <SuggestionItem
                                            command={suggestion.command}
                                            example={suggestion.example}
                                            description={suggestion.description}
                                            isSelected={index === selectedIndex}
                                            onClick={() => insertSuggestion(suggestion)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <p className="text-destructive text-sm">{error}</p>}

                    {preview && (
                        <div className="bg-muted/50 rounded-md p-4">
                            <p className="text-muted-foreground mb-2 text-xs">Preview:</p>
                            <div
                                className={inline ? 'inline-block' : 'text-center'}
                                dangerouslySetInnerHTML={{ __html: preview }}
                            />
                        </div>
                    )}

                    <div className="bg-muted/30 rounded-md p-3">
                        <p className="text-muted-foreground mb-2 text-xs font-medium">Quick insert:</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'Fraction', value: '\\frac{a}{b}' },
                                { label: 'Square root', value: '\\sqrt{x}' },
                                { label: 'Exponent', value: 'x^{2}' },
                                { label: 'Subscript', value: 'x_{i}' },
                                { label: 'Sum', value: '\\sum_{i=1}^{n} x_i' },
                                { label: 'Integral', value: '\\int_0^\\infty f(x) dx' },
                            ].map((example) => (
                                <button
                                    key={example.value}
                                    type="button"
                                    onClick={() => setEquation(example.value)}
                                    className="bg-muted hover:bg-muted/80 rounded px-2 py-1 text-xs"
                                >
                                    {example.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleInsert} disabled={!equation || !!error}>
                        Insert
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function EquationToolbarButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="h-8 w-8 p-0"
            aria-label="Insert equation"
            title="Insert equation"
        >
            <Sigma className="h-4 w-4" />
        </Button>
    );
}
