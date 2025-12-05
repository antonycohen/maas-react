import { useCallback, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import {
  Handle,
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';

export type ApiEntrypointData = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  isPublic: boolean;
  label?: string;
  queryParams?: Array<{ name: string; value: string }>;
  bodyDto?: string;
};

export function ApiEntrypointNode({ id, data }: NodeProps<Node<ApiEntrypointData>>) {
  const { setNodes } = useReactFlow<Node<ApiEntrypointData>>();

  const onChange = useCallback(
    (partial: Partial<ApiEntrypointData>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...partial } } : n))
      );
    },
    [id, setNodes]
  );

  const title = useMemo(() => data.label ?? "API Entrypoint", [data.label]);

  const handleAddQueryParam = useCallback(() => {
    const newParams = [...(data.queryParams || []), { name: '', value: '' }];
    onChange({ queryParams: newParams });
  }, [data.queryParams, onChange]);

  const handleQueryParamChange = useCallback((index: number, field: 'name' | 'value', value: string) => {
    const newParams = [...(data.queryParams || [])];
    newParams[index] = { ...newParams[index], [field]: value };
    onChange({ queryParams: newParams });
  }, [data.queryParams, onChange]);

  const handleDeleteQueryParam = useCallback((index: number) => {
    const newParams = (data.queryParams || []).filter((_, i) => i !== index);
    onChange({ queryParams: newParams });
  }, [data.queryParams, onChange]);

  const showBodySelector = ['POST', 'PUT', 'PATCH'].includes(data.method);

  return (
    <div className="w-[320px] rounded-2xl border border-slate-300 bg-white shadow-sm">
      <div className="flex items-center justify-between rounded-t-2xl bg-slate-50 px-3 py-2">
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span
          className={
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium " +
            (data.isPublic ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700")
          }
        >
          {data.isPublic ? "public" : "private"}
        </span>
      </div>

      <div className="space-y-3 p-3">
        {/* Method */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">Method</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400 focus:ring-0"
            value={data.method}
            onChange={(e) => onChange({ method: (e.currentTarget as HTMLSelectElement).value as ApiEntrypointData["method"] })}
          >
            {(["GET", "POST", "PUT", "PATCH", "DELETE"] as const).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Path */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">Path</label>
          <input
            type="text"
            placeholder="/api/v1/users/:id"
            className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-0"
            value={data.path}
            onChange={(e) => onChange({ path: (e.currentTarget as HTMLInputElement).value })}
          />
        </div>

        {/* Query Params */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-medium text-slate-600">Query Parameters</label>
            <button
              type="button"
              onClick={handleAddQueryParam}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              + Add
            </button>
          </div>
          {data.queryParams && data.queryParams.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {data.queryParams.map((param, index) => (
                <div key={index} className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="name"
                    className="flex-1 min-w-0 rounded border border-slate-200 px-1.5 py-0.5 text-xs outline-none focus:border-slate-400"
                    value={param.name}
                    onChange={(e) => handleQueryParamChange(index, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="value"
                    className="flex-1 min-w-0 rounded border border-slate-200 px-1.5 py-0.5 text-xs outline-none focus:border-slate-400"
                    value={param.value}
                    onChange={(e) => handleQueryParamChange(index, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteQueryParam(index)}
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body DTO Selector */}
        {showBodySelector && (
          <div>
            <label className="block text-[11px] font-medium text-slate-600">Body DTO</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400 focus:ring-0"
              value={data.bodyDto || ''}
              onChange={(e) => onChange({ bodyDto: e.currentTarget.value || undefined })}
            >
              <option value="">None</option>
              <option value="UserCreateDTO">UserCreateDTO</option>
              <option value="UserUpdateDTO">UserUpdateDTO</option>
              <option value="ProductDTO">ProductDTO</option>
              <option value="OrderDTO">OrderDTO</option>
              <option value="AuthLoginDTO">AuthLoginDTO</option>
              <option value="AuthRegisterDTO">AuthRegisterDTO</option>
            </select>
          </div>
        )}

        {/* Public/Private */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-600">Visibility</span>
          <button
            type="button"
            onClick={() => onChange({ isPublic: !data.isPublic })}
            className={
              "relative inline-flex h-6 w-10 items-center rounded-full transition-colors " +
              (data.isPublic ? "bg-emerald-500" : "bg-slate-300")
            }
            aria-pressed={data.isPublic}
            aria-label="Toggle public/private"
          >
            <span
              className={
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform " +
                (data.isPublic ? "translate-x-5" : "translate-x-0")
              }
            />
          </button>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!h-3 !w-3 !bg-slate-500" />
      <Handle type="source" position={Position.Right} className="!h-3 !w-3 !bg-slate-500" />
    </div>
  );
}
