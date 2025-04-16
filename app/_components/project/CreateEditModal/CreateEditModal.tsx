import { Button } from "@/components/ui";
import { Column as ColumnType, Task as TaskType } from "@/types";
import {X as Close} from 'lucide-react'
import { useState } from "react";
import { SketchPicker } from 'react-color';
import { CreateColumn, CreateTask, editColumn } from "@/app/db";

export default function CreateEditModal ({type, close, parentId, data, updateList}: {type: "COLUMN" | "TASK",close: () => void, parentId: string, data?: ColumnType | TaskType,  updateList: () => void } ) {
  const [name, setName] = useState<string>(data?.name || '')
  const [description, setDescription] = useState<string>(data?.description || '')
  const [color, setColor] = useState<string>(data?.color || '')
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false)

  const closeModal = ():void => {
    setName('')
    setDescription('')
    setColor('')
    setIsColorPickerOpen(false)
    close()
  }
 
  const handleSubmit = () => {
    if(name && description && parentId){
      if(data?._id){
        const updatedData = {
          ...(name ? {name} : {}),
          ...(description ? {description} : {}),
          ...(color ? {color} : {}),
        }

        editColumn(data?._id, updatedData, ()=>{
          closeModal();
          updateList();
        })
      }else{
        if(type === 'COLUMN'){
          CreateColumn(parentId, {name, description, ...(color ? {color} : {})}, ()=>{
            closeModal();
            updateList();
          })
        }
        
        if(type === 'TASK'){
          CreateTask(parentId, {name, description, ...(color ? {color} : {})}, ()=>{
            closeModal();
            updateList();
          })
        }
      }
    }
  }
  
  return (
    <div className="bg-black/40 w-full h-full absolute top-0 flex justify-center items-center cursor-pointer z-9999" onClick={()=>closeModal()}>
      <div className="bg-white p-5 w-[500px] rounded-xl cursor-auto" onClick={(event)=>event.stopPropagation()}>
        <span className="flex justify-between items-center mb-5">
          <p>{data?._id ? 'Modifier une ' : 'Créer une '}{type === "COLUMN" ? 'colonne' : type === 'TASK' && 'tâche'}</p>
          <Close cursor='pointer' width={20} height={20} onClick={()=>closeModal()} />
        </span>
        <form className="flex flex-col gap-2">
          <input className="border-1 px-2 py-1 rounded-xl" type="text" placeholder={`Nom de la ${type === "COLUMN" ? 'colonne' : type === 'TASK' && 'tâche'}`} value={name} onChange={(e)=>setName(e.target.value)}/>
          <textarea className="border-1 px-2 py-1 rounded-xl" placeholder={`Description de la ${type === "COLUMN" ? 'colonne' : type === 'TASK' && 'tâche'}`} value={description} onChange={(e)=>setDescription(e.target.value)}/>
          <label>Couleur de la {type === "COLUMN" ? 'colonne' : type === 'TASK' && 'tâche'}</label>
          <span onClick={()=>setIsColorPickerOpen(!isColorPickerOpen)} style={{backgroundColor: color}} className="rounded-2xl border-1 border-black h-[20px] w-[20px]"/>
          {isColorPickerOpen && <SketchPicker
            className="absolute translate-y-[50%] mt-2"
            color={ color }
            onChange={ (e)=> setColor(e.hex) } />}
          <Button className="mt-3" onClick={handleSubmit}>{data?._id  ? 'Modifier' : 'Créer'}</Button>
        </form>
      </div>
    </div>
  )
}
