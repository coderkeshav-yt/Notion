'use client'	

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useTheme } from "next-themes"
import { PartialBlock } from '@blocknote/core'
import { useEdgeStore } from "@/lib/edgestore"

interface EditorProps{
  onChange:(value:string) => void
  initialContent?:string
  editable?:boolean
}

function Editor ({onChange,initialContent,editable}:EditorProps) {

  const {resolvedTheme} = useTheme()
  const {edgestore} = useEdgeStore()

  const handleUpload = async (file:File) => {
    const response = await edgestore.publicFiles.upload({file})

    return response.url
  }

  const editor = useCreateBlockNote({
    initialContent:initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile:handleUpload,
    slashCommands: (defaultCommands: any) => {
      const dividerCommand = {
        name: "Divider",
        execute: (editor: any) => {
          const currentBlock = editor.getTextCursorPosition().block
          editor.insertBlocks([{
            type: "paragraph",
            content: "─".repeat(50)
          }], currentBlock, "after")
        },
        aliases: ["divider", "line", "separator", "hr"],
        group: "Others",
        icon: "➖",
        hint: "Insert a horizontal divider line"
      }
      return [...defaultCommands, dividerCommand]
    }
  } as any)

  return (
    <div>
      <BlockNoteView 
        editor={editor} 
        editable={editable} 
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'} 
        onChange={() => {
          onChange(JSON.stringify(editor.document,null,2))
        }}
      />
    </div>
  )
}

export default Editor
