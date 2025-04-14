import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import {
  BoldIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";

import { EditorContent, useEditor, type EditorOptions } from "@tiptap/react";
import { Divider } from "@/components/ui/divider.tsx";
import { Button } from "@/components/ui/button.tsx";

import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import History from "@tiptap/extension-history";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Link from "@tiptap/extension-link";
import Italic from "@tiptap/extension-italic";
import HardBreak from "@tiptap/extension-hard-break";
import Blockquote from "@tiptap/extension-blockquote";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

const extensions = [
  Document,
  Placeholder.configure({
    placeholder: "내용을 입력해주세요",
  }),
  History,
  ListItem,
  OrderedList,
  Text,
  Link.configure({
    openOnClick: false,
  }),
  Paragraph.extend({
    renderHTML({ HTMLAttributes }) {
      return ["div", HTMLAttributes, 0];
    },
  }),
  Blockquote,
  HardBreak,
  Heading,
  Bold,
  Underline,
  Strike,
  Italic,
  Image,
];

Paragraph.configure({
  HTMLAttributes: {
    tag: "div",
  },
});

export function Editor({
  name,
  content,
  onUpdate,
}: {
  name?: string;
  content?: string;
  onUpdate?: EditorOptions["onUpdate"];
}) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions,
    content: content,
    editorProps: {
      attributes: {
        name,
        class: "px-4 py-3",
      },
    },
    onUpdate,
  });

  if (!editor) return null;

  return (
    <div className="border rounded border-gray-200">
      <div className="px-4 py-3 flex items-center gap-1">
        <Button plain data-active={editor.isActive("bold") ? "" : undefined}>
          <BoldIcon onClick={() => editor.chain().focus().toggleBold().run()} />
        </Button>

        <Button plain data-active={editor.isActive("italic") ? "" : undefined}>
          <ItalicIcon
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </Button>

        <Button plain data-active={editor?.isActive("strike") ? "" : undefined}>
          <StrikethroughIcon
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
        </Button>

        <Button
          plain
          data-active={editor?.isActive("underline") ? "" : undefined}
        >
          <UnderlineIcon
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
        </Button>

        <Button plain data-active={editor?.isActive("link") ? "" : undefined}>
          <Link2Icon
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href;
              const url = window.prompt("URL", previousUrl);

              // cancelled
              if (url === null) {
                return;
              }

              // empty
              if (url === "") {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();

                return;
              }

              // update link
              try {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url })
                  .run();
              } catch (e) {
                alert(e.message);
              }
            }}
          />
        </Button>

        <hr className="w-[1px] h-6 border-none bg-gray-300" />

        <select
          value={editor.isActive("heading") ? "1" : ""}
          onChange={({ currentTarget: { value } }) => {
            if (value) {
              editor
                .chain()
                .focus()
                // @ts-ignore
                .setHeading({ level: Number.parseInt(value) })
                .run();
            } else {
              editor.isActive("heading", { level: 1 });
              editor.chain().focus().toggleHeading({ level: 0 }).run();
            }
          }}
        >
          <option value="1">Heading 1</option>
          <option value="">Normal</option>
        </select>

        <Button
          plain
          data-active={editor?.isActive("blockquote") ? "" : undefined}
        >
          <QuoteIcon
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          />
        </Button>
        <Button
          plain
          data-active={editor?.isActive("list-item") ? "" : undefined}
        >
          <ListIcon
            onClick={() => editor?.chain().focus().toggleList().run()}
          />
        </Button>

        <Button
          plain
          data-active={editor?.isActive("ordered-item") ? "" : undefined}
        >
          <ListOrderedIcon
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
        </Button>

        <Button plain>
          <ImageIcon
            onClick={() => {
              imageInputRef.current.click();
            }}
          />
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              // 파일 업로드 API 호출
              const formData = new FormData();
              formData.append("file", file);

              const response = await apiClient("/admin/file-upload", {
                method: "POST",
                body: formData,
              });

              if (!response.ok) {
                throw new Error("이미지 업로드에 실패했습니다");
              }

              const data = await response.json();
              // API 응답에서 이미지 URL을 가져옵니다
              const imageUrl = data.url;

              // 에디터에 이미지 삽입
              editor?.chain().focus().setImage({ src: imageUrl }).run();
            } catch (error) {
              console.error("이미지 업로드 오류:", error);
              alert("이미지 업로드 중 오류가 발생했습니다.");
            } finally {
              // 파일 입력란 초기화
              e.target.value = "";
            }
          }}
        />
        <hr className="w-[1px] h-6 border-none bg-gray-300" />

        <Button plain disabled={!editor.can().undo()}>
          <UndoIcon onClick={() => editor.commands.undo()} />
        </Button>
        <Button
          plain
          disabled={!editor.can().redo()}
          data-active={editor?.isActive("underline") ? "" : undefined}
        >
          <RedoIcon onClick={() => editor.commands.redo()} />
        </Button>
      </div>
      <Divider />
      <EditorContent
        className="max-h-[500px] overflow-y-auto"
        editor={editor}
      />
    </div>
  );
}
