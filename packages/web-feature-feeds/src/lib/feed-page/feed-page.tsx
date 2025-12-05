import { ComponentType, useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  type Edge,
  type Node,
  type NodeProps,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow
} from '@xyflow/react';
import { ApiEntrypointData, ApiEntrypointNode, HttpRequestData, HttpRequestNode } from '../nodes';
import { LayoutBreadcrumb, LayoutHeader } from '@maas/web-layout';

const nodeTypes = {
  apiEntrypoint: ApiEntrypointNode as ComponentType<NodeProps>,
  httpRequest: HttpRequestNode as ComponentType<NodeProps>,
};


export const FeedPage = () => {
  const [nodes, setNodes] = useState<Node<ApiEntrypointData|HttpRequestData>[]>([
    {
      id: '1',
      type: 'apiEntrypoint',
      data: {
        method: 'GET',
        path: '/api/v1/users',
        isPublic: true,
        label: 'Get Users'
      },
      position: { x: 100, y: 100 }
    },
    {
      id: '2',
      type: 'apiEntrypoint',
      data: {
        method: 'POST',
        path: '/api/v1/users',
        isPublic: false,
        label: 'Create User'
      },
      position: { x: 400, y: 100 }
    },
    {
      id: '3',
      type: 'httpRequest',
      data: {
        method: 'GET',
        url: '/apis',
        label: 'Http Request'
      },
      position: { x: 250, y: 300 }
    }
  ]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds) as Node<ApiEntrypointData>[]),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className="flex h-full w-full flex-col">
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: '/' }
          ]}
        />
        <LayoutHeader pageTitle={'Flow'} />
      </header>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
