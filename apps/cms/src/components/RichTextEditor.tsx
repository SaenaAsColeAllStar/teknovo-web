import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { ReactNode } from "react";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

export function RichTextEditor({ value, onChange, disabled }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-48 px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  if (!editor) {
    return <div className="min-h-56 border border-[var(--border)] bg-white" />;
  }

  return (
    <div
      className={`overflow-hidden border border-[var(--border)] bg-white ${disabled ? "opacity-60" : ""}`}
    >
      <div className="flex flex-wrap gap-1 border-b border-[var(--border)] bg-[var(--soft)] p-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="List"
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Ordered"
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Undo"
          disabled={disabled}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={disabled}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  active,
  disabled,
  onClick,
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center border border-transparent ${
        active ? "bg-white border-[var(--border)]" : "hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}
