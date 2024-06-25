import "../styles/styles.css"
import { Color } from "@tiptap/extension-color"
import ListItem from "@tiptap/extension-list-item"
import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style"
import { EditorProvider, useCurrentEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { blogContentAtom, blogOldData } from "../recoil/atom/blogAtom"
import { useRecoilState, useRecoilValue } from "recoil"
import { useEffect } from "react"

const UpdateBlogEditor = () => {
  const { editor } = useCurrentEditor()
  const [_, setContent] = useRecoilState(blogContentAtom)

  if (!editor) {
    return null
  }


    useEffect(() => {
      const data = editor.getHTML()
      setContent(data)
    }, [editor.getHTML()])
      




  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "bg-slate-300 p-1 rounded-lg m-0.5"
              : "bg-slate-100 p-1 rounded-lg m-0.5"
          }
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "bg-slate-300 p-1 rounded-lg m-0.5"
              : "bg-slate-100 p-1 rounded-lg m-0.5"
          }
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? "bg-slate-300 p-1 rounded-lg m-0.5"
              : "bg-slate-100 p-1 rounded-lg m-0.5"
          }
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph")
              ? "bg-slate-300 p-1 rounded-lg m-0.5"
              : "bg-slate-100 p-1 rounded-lg m-0.5"
          }
        >
          Paragraph
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-orange-300 p-1 rounded-lg m-0.5"
              : "bg-orange-200 p-1 rounded-lg m-0.5"
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-orange-300 p-1 rounded-lg m-0.5"
              : "bg-orange-200 p-1 rounded-lg m-0.5"
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-orange-300 p-1 rounded-lg m-0.5"
              : "bg-orange-200 p-1 rounded-lg m-0.5"
          }
        >
          H3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 })
              ? "bg-orange-300 p-1 rounded-lg m-0.5"
              : "bg-orange-200 p-1 rounded-lg m-0.5"
          }
        >
          H4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 })
              ? "bg-orange-300 p-1 rounded-lg m-0.5"
              : "bg-orange-200 p-1 rounded-lg m-0.5"
          }
        >
          H5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 })
              ? "bg-orange-300 p-1 rounded-lg m-0.5"
              : "bg-orange-200 p-1 rounded-lg m-0.5"
          }
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "bg-orange-300 p-1 rounded-lg m-0.5"
              : "bg-orange-200 p-1 rounded-lg m-0.5"
          }
        >
          Bullet list
        </button>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as Partial<TextStyleOptions>),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, 
    },
  }),
]

export default () => {

  const oldContent = useRecoilValue(blogOldData)

  return (
    <EditorProvider
      slotBefore={<UpdateBlogEditor />}
      content={oldContent.content}
      extensions={extensions}
    ></EditorProvider>
  )
}
