import { Button } from "@/components/ui";
import { Column as ColumnType } from "@/types";
import {X as Close} from 'lucide-react'
import { useState } from "react";
import { SketchPicker } from 'react-color';
import { CreateColumn, editColumn } from "@/app/db";

export default function CreateEditColumnModal ({close, projectId, column, updateList}: {close: () => void, projectId: string, column?: ColumnType,  updateList: () => void } ) {
  const [name, setName] = useState<string>(column?.name || '')
  const [description, setDescription] = useState<string>(column?.description || '')
  const [color, setColor] = useState<string>(column?.color || '')
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false)

  const closeModal = ():void => {
    setName('')
    setDescription('')
    setColor('')
    setIsColorPickerOpen(false)
    close()
  }
 
  const handleSubmit = () => {
    if(name && description && projectId){
      if(column?._id){
        const updatedData = {
          ...(name ? {name} : {}),
          ...(description ? {description} : {}),
          ...(color ? {color} : {}),
        }

        editColumn(column?._id, updatedData, ()=>{
          closeModal();
          updateList();
        })
      }else{
        CreateColumn(projectId, {name, description, ...(color ? {color} : {})}, ()=>{
          closeModal();
          updateList();
        })
      }
    }
  }
  
  return (
    <div className="bg-black/40 w-full h-full absolute top-0 flex justify-center items-center cursor-pointer z-9999" onClick={()=>closeModal()}>
      <div className="bg-white p-5 w-[500px] rounded-xl cursor-auto" onClick={(event)=>event.stopPropagation()}>
        <span className="flex justify-between items-center mb-5">
          <p>{column?._id ? 'Modifier une colonne' : 'Créer une colonne'}</p>
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
          <Button className="mt-3" onClick={handleSubmit}>{column?._id  ? 'Modifier' : 'Créer'}</Button>
        </form>
      </div>
    </div>
  )
}
