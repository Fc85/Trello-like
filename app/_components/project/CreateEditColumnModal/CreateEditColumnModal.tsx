import { Button } from "@/components/ui";
import { Column, Project } from "@/types";
import {X as Close} from 'lucide-react'
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { SketchPicker } from 'react-color';

export default function CreateEditColumnModal ({close, project, columnId, updateList}: {close: () => void, project: Project, columnId?: string,  updateList: () => void } ) {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false)

  const closeModal = ():void => {
    setName('')
    setDescription('')
    setColor('')
    setIsColorPickerOpen(false)
    close()
  }
 
  const handleSubmit = (): void => {
      if(name && description && project._id){
        const columnsList: string = window.localStorage.getItem('columns') || ''
        const projectsList: string = window.localStorage.getItem('projects') || ''
        const parsedColumnsList: Column[] = columnsList ? JSON.parse(columnsList) : []
        const parsedProjectsList: Project[] = projectsList ? JSON.parse(projectsList) : []
        const projectIndex: number = parsedProjectsList.findIndex((item: Project)=>item._id === project._id)

        const newColumn: Column = {
                  _id: uuidv4(),
                  name,
                  description,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ...(color ? {color} : {})
        }

        parsedColumnsList.push(newColumn)

        if(projectIndex !== -1){
          parsedProjectsList[projectIndex].columns = [ ...(parsedProjectsList[projectIndex].columns || []), newColumn._id]

          window.localStorage.setItem('columns', JSON.stringify(parsedColumnsList))
          window.localStorage.setItem('projects', JSON.stringify(parsedProjectsList))

          closeModal()
          updateList()
        }
      }
  }
  
  return (
    <div className="bg-black/40 w-full h-full absolute top-0 flex justify-center items-center cursor-pointer z-9999" onClick={()=>closeModal()}>
      <div className="bg-white p-5 w-[500px] rounded-xl cursor-auto" onClick={(event)=>event.stopPropagation()}>
        <span className="flex justify-between items-center mb-5">
          <p>{columnId ? 'Modifier une colonne' : 'Créer une colonne'}</p>
          <Close cursor='pointer' width={20} height={20} onClick={()=>closeModal()} />
        </span>
        <form className="flex flex-col gap-2">
          <input className="border-1 px-2 py-1 rounded-xl" type="text" placeholder="Nom de la colonne" value={name} onChange={(e)=>setName(e.target.value)}/>
          <textarea className="border-1 px-2 py-1 rounded-xl" placeholder="Description de la colonne" value={description} onChange={(e)=>setDescription(e.target.value)}/>
          <label>Couleur de la colonne</label>
          <span onClick={()=>setIsColorPickerOpen(!isColorPickerOpen)} style={{backgroundColor: color}} className="rounded-2xl border-1 border-black h-[20px] w-[20px]"/>
          {isColorPickerOpen && <SketchPicker
            className="absolute translate-y-[50%] mt-2"
            color={ color }
            onChange={ (e)=> setColor(e.hex) } />}
          <Button className="mt-3" onClick={handleSubmit}>{columnId ? 'Modifier' : 'Créer'}</Button>
        </form>
      </div>
    </div>
  )
}
