import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import React from "react";
import Underline from '@tiptap/extension-underline'
import {
  AiOutlineBold,
  AiOutlineEnter,
  AiOutlineItalic,
  AiOutlineStrikethrough,
} from "react-icons/ai";
import { BsParagraph } from "react-icons/bs";
import { MdFormatListBulleted } from "react-icons/md";
import { GrOrderedList } from "react-icons/gr";
import { TbBlockquote } from "react-icons/tb";
import { BiRedo, BiUndo } from "react-icons/bi";

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap space-y-2 items-center space-x-4 text-white border-b border-color-primary p-3">
      <div className="flex items-center space-x-2 text-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "is-active" : "hover:text-green-500"
          }
        >
          <AiOutlineBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic") ? "is-active" : "hover:text-green-500"
          }
        >
          <AiOutlineItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike") ? "is-active" : "hover:text-green-500"
          }
        >
          <AiOutlineStrikethrough />
        </button>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph") ? "is-active" : "hover:text-green-500"
          }
        >
          <BsParagraph />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "is-active"
              : "hover:text-green-500"
          }
        >
          h1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "is-active"
              : "hover:text-green-500"
          }
        >
          h2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "is-active"
              : "hover:text-green-500"
          }
        >
          h3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 })
              ? "is-active"
              : "hover:text-green-500"
          }
        >
          h4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 })
              ? "is-active"
              : "hover:text-green-500"
          }
        >
          h5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 })
              ? "is-active"
              : "hover:text-green-500"
          }
        >
          h6
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          <AiOutlineEnter />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "is-active" : "hover:text-green-500"
          }
        >
          <MdFormatListBulleted />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "is-active"
              : "hover:text-green-500"
          }
        >
          <GrOrderedList />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote") ? "is-active" : "hover:text-green-500"
          }
        >
          <TbBlockquote />
        </button>
      </div>
      <div className="flex items-center space-x-2 text-lg">
        <button
          className="hover:text-green-500 cursor-pointer"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <BiUndo />
        </button>
        <button
          className="hover:text-green-500 cursor-pointer"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <BiRedo />
        </button>
      </div>
    </div>
  );
};

const TipTap = ({
  validator,
  descValue,
  setDesc,
}: {
  validator: string | undefined;
  descValue?: string;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Write something awesome...",
        }),
      ],
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        setDesc(html);
      },
      content: `${descValue}`,
    },
    [descValue]
  );

  return (
    <div
      className={`border rounded-2xl mt-2 ${
        validator ? "border-red-500" : "border-color-primary"
      }`}
    >
      <MenuBar editor={editor} />
      <EditorContent
        className="min-h-[176px] text-sm px-[15px] py-3 text-white"
        editor={editor}
      />
    </div>
  );
};

export default TipTap;
