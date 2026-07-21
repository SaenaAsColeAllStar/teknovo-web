"use client";

import {
  DndContext,
  type DraggableAttributes,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useState,
} from "react";
import { toast } from "sonner";

import {
  ApiClientError,
  reorderSiteContent,
  type SiteContentEntityPath,
} from "@/lib/api-client";
import { cn } from "@/lib/utils";

export type SortableItem = { id: string; sortOrder: number };

type SortableContentRowsProps<T extends SortableItem> = {
  entity: SiteContentEntityPath;
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  getToken: () => Promise<string | null>;
  enabled: boolean;
  children: (row: T, handle: ReactNode) => ReactNode;
};

function DragHandle({
  attributes,
  listeners,
  disabled,
}: {
  attributes: DraggableAttributes;
  listeners?: Record<string, Function>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-8 items-center justify-center border border-[color:var(--color-border)] bg-white text-[color:var(--color-body)]",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-grab active:cursor-grabbing hover:bg-[color:var(--color-neutral-soft)]",
      )}
      aria-label="Geser untuk mengubah urutan"
      disabled={disabled}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" aria-hidden />
    </button>
  );
}

function SortableTr({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled?: boolean;
  children: (handle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : undefined,
    background: isDragging ? "var(--color-neutral-soft)" : undefined,
    zIndex: isDragging ? 1 : undefined,
    position: "relative",
  };

  const handle = (
    <DragHandle
      attributes={attributes}
      listeners={listeners}
      disabled={disabled}
    />
  );

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-[color:var(--color-border)] last:border-0"
    >
      {children(handle)}
    </tr>
  );
}

/**
 * Drag-and-drop rows for site-content lists. Persists via POST /v1/:entity/reorder.
 * When `enabled` is false, rows render without DnD (still via children).
 */
export function SortableContentRows<T extends SortableItem>({
  entity,
  items,
  setItems,
  getToken,
  enabled,
  children,
}: SortableContentRowsProps<T>) {
  const [saving, setSaving] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const persist = useCallback(
    async (ordered: T[]) => {
      const payload = ordered.map((row, index) => ({
        id: row.id,
        sortOrder: index,
      }));
      setSaving(true);
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        await reorderSiteContent(entity, payload, token);
        toast.success("Urutan disimpan");
      } catch (err) {
        toast.error(
          err instanceof ApiClientError
            ? err.message
            : "Gagal menyimpan urutan.",
        );
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [entity, getToken],
  );

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = items.findIndex((row) => row.id === active.id);
      const newIndex = items.findIndex((row) => row.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;

      const previous = items;
      const moved = arrayMove(items, oldIndex, newIndex).map((row, index) => ({
        ...row,
        sortOrder: index,
      }));
      setItems(moved);
      try {
        await persist(moved);
      } catch {
        setItems(previous);
      }
    },
    [items, persist, setItems],
  );

  if (!enabled) {
    return (
      <>
        {items.map((row) => (
          <tr
            key={row.id}
            className="border-b border-[color:var(--color-border)] last:border-0"
          >
            {children(row, null)}
          </tr>
        ))}
      </>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => {
        void onDragEnd(e);
      }}
    >
      <SortableContext
        items={items.map((row) => row.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((row) => (
          <SortableTr key={row.id} id={row.id} disabled={saving}>
            {(handle) => children(row, handle)}
          </SortableTr>
        ))}
      </SortableContext>
    </DndContext>
  );
}

/** Column header cell for the drag handle column. */
export function SortableHandleHeader() {
  return (
    <th className="w-10 px-2 py-3 font-medium" aria-label="Urutan">
      <span className="sr-only">Urutan</span>
    </th>
  );
}
