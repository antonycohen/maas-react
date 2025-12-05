import { useCallback, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import {
  Handle,
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';

export type HttpRequestData = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  headers?: Array<{ name: string; value: string }>;
  body?: string;
  label?: string;
};

export function HttpRequestNode({ id, data }: NodeProps<Node<HttpRequestData>>) {
  const { setNodes } = useReactFlow<Node<HttpRequestData>>();

  const onChange = useCallback(
    (partial: Partial<HttpRequestData>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...partial } } : n))
      );
    },
    [id, setNodes]
  );

  const title = useMemo(() => data.label ?? "HTTP Request", [data.label]);

  const handleAddHeader = useCallback(() => {
    const newHeaders = [...(data.headers || []), { name: '', value: '' }];
    onChange({ headers: newHeaders });
  }, [data.headers, onChange]);

  const handleHeaderChange = useCallback((index: number, field: 'name' | 'value', value: string) => {
    const newHeaders = [...(data.headers || [])];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    onChange({ headers: newHeaders });
  }, [data.headers, onChange]);

  const handleDeleteHeader = useCallback((index: number) => {
    const newHeaders = (data.headers || []).filter((_, i) => i !== index);
    onChange({ headers: newHeaders });
  }, [data.headers, onChange]);

  const showBody = ['POST', 'PUT', 'PATCH'].includes(data.method);

  const methodColorClasses: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700',
    POST: 'bg-green-100 text-green-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    PATCH: 'bg-orange-100 text-orange-700',
    DELETE: 'bg-red-100 text-red-700',
    HEAD: 'bg-purple-100 text-purple-700',
    OPTIONS: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="w-[320px] rounded-2xl border border-slate-300 bg-white shadow-sm">
      <div className="flex items-center justify-between rounded-t-2xl bg-slate-50 px-3 py-2">
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            methodColorClasses[data.method] || 'bg-slate-200 text-slate-700'
          }`}
        >
          {data.method}
        </span>
      </div>

      <div className="space-y-3 p-3">
        {/* URL */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">URL</label>
          <input
            type="text"
            placeholder="https://api.example.com/endpoint"
            className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-0"
            value={data.url}
            onChange={(e) => onChange({ url: (e.currentTarget as HTMLInputElement).value })}
          />
        </div>

        {/* Method */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">Method</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400 focus:ring-0"
            value={data.method}
            onChange={(e) => onChange({ method: (e.currentTarget as HTMLSelectElement).value as HttpRequestData["method"] })}
          >
            {(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Headers */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-medium text-slate-600">Headers</label>
            <button
              type="button"
              onClick={handleAddHeader}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              + Add
            </button>
          </div>
          {data.headers && data.headers.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {data.headers.map((header, index) => (
                <div key={index} className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="name"
                    className="flex-1 min-w-0 rounded border border-slate-200 px-1.5 py-0.5 text-xs outline-none focus:border-slate-400"
                    value={header.name}
                    onChange={(e) => handleHeaderChange(index, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="value"
                    className="flex-1 min-w-0 rounded border border-slate-200 px-1.5 py-0.5 text-xs outline-none focus:border-slate-400"
                    value={header.value}
                    onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteHeader(index)}
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        {showBody && (
          <div>
            <label className="block text-[11px] font-medium text-slate-600">Body</label>
            <textarea
              placeholder='{"key": "value"}'
              className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 min-h-[80px] resize-y"
              value={data.body || ''}
              onChange={(e) => onChange({ body: e.currentTarget.value || undefined })}
            />
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!h-3 !w-3 !bg-slate-500" />
      <Handle type="source" position={Position.Right} className="!h-3 !w-3 !bg-slate-500" />
    </div>
  );
}