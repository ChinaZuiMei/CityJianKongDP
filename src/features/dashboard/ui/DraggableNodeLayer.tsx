import React from 'react';
import { cn } from '../../../utils/cn';

type NodePosition = {
  x: number;
  y: number;
};

export type DraggableNodeConfig = {
  id: string;
  initialPosition: NodePosition;
  className?: string;
  content: React.ReactNode;
};

export const DraggableNodeLayer = ({
  nodes,
  className,
}: {
  nodes: DraggableNodeConfig[];
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [positions, setPositions] = React.useState<Record<string, NodePosition>>(() =>
    Object.fromEntries(nodes.map((node) => [node.id, node.initialPosition])),
  );
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [draggingNode, setDraggingNode] = React.useState<string | null>(null);
  const dragStateRef = React.useRef<{
    id: string;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    width: number;
    height: number;
  } | null>(null);

  React.useEffect(() => {
    setPositions((current) => {
      const next: Record<string, NodePosition> = {};
      nodes.forEach((node) => {
        next[node.id] = current[node.id] ?? node.initialPosition;
      });
      return next;
    });
  }, [nodes]);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStateRef.current) return;
      const { id, startClientX, startClientY, startX, startY, width, height } = dragStateRef.current;
      const deltaX = ((event.clientX - startClientX) / width) * 100;
      const deltaY = ((event.clientY - startClientY) / height) * 100;

      setPositions((current) => ({
        ...current,
        [id]: {
          x: Math.min(94, Math.max(6, Number((startX + deltaX).toFixed(2)))),
          y: Math.min(92, Math.max(8, Number((startY + deltaY).toFixed(2)))),
        },
      }));
    };

    const handleMouseUp = () => {
      dragStateRef.current = null;
      setDraggingNode(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      {nodes.map((node) => {
        const position = positions[node.id] ?? node.initialPosition;
        const isSelected = selectedNode === node.id;
        const isDragging = draggingNode === node.id;

        return (
          <div
            key={node.id}
            className={cn(
              "absolute z-10 select-none rounded-2xl transition-[left,top,box-shadow,opacity] duration-150",
              "cursor-grab",
              isSelected && "ring-2 ring-sky-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.45),0_0_24px_rgba(14,165,233,0.18)]",
              isDragging && "cursor-grabbing opacity-90",
              node.className,
            )}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(event) => {
              event.stopPropagation();
              setSelectedNode(node.id);
            }}
            onMouseDown={(event) => {
              if (event.button !== 0) return;
              event.stopPropagation();
              const rect = containerRef.current?.getBoundingClientRect();
              if (!rect) return;
              setSelectedNode(node.id);
              setDraggingNode(node.id);
              dragStateRef.current = {
                id: node.id,
                startClientX: event.clientX,
                startClientY: event.clientY,
                startX: position.x,
                startY: position.y,
                width: rect.width,
                height: rect.height,
              };
            }}
          >
            {node.content}
          </div>
        );
      })}
    </div>
  );
};
