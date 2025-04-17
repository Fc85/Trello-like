import { Column, Project, Task } from "@/types"
import { v4 as uuidv4 } from 'uuid';

export function getProjects(): Project[] {
  const fromLS: string = window.localStorage.getItem('projects') || ''
  const parsed: Project[] = fromLS ? JSON.parse(fromLS) : []

  return parsed
}

export function getOneProject<TP extends {populateColumns: boolean} = {populateColumns: false}, TC extends {populateTasks: boolean} = {populateTasks: false}>(id: string, projectOptions?: TP, columnOptions?: TC): Project<TP> | null {
  const projectsList = getProjects()
  const matchingProject: Project | undefined = projectsList.find((item: Project)=>item._id === id)

  if(matchingProject){
    if(projectOptions?.populateColumns){
      const columns = getColumns(columnOptions)
      const filteredColumns = columns.filter((item:Column<TC>)=> matchingProject.columns?.includes(item._id))
      const newProjectData: Project<TP> = {...matchingProject, columns: filteredColumns} as Project<TP>
      
      return newProjectData
    }

    return matchingProject as  Project<TP>
  }
  return null
}

export function createProject(data: {name:string, description:string}, onFinish: ()=>void = ()=>{}) {
  const projectsList = getProjects()

  const newProject: Project = {
    _id: uuidv4(),
    name: data.name,
    description: data.description,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  projectsList.push(newProject)
  window.localStorage.setItem('projects', JSON.stringify(projectsList))
  onFinish()
}

export function editProject(id: string, data: {name?:string, description?:string, columns?:string[]} ,onFinish: ()=>void = ()=>{}) {
  const projectsList = getProjects()
  const projectIndex: number = projectsList.findIndex((item: Project)=>item._id === id)

  if(projectIndex !== -1){
    projectsList[projectIndex] = {
      ...projectsList[projectIndex],
      ...(data.name ? {name: data.name} : {}),
      ...(data.description ? {description: data.description} : {}),
      ...(data.columns ? {columns: data.columns} : {}),
      updatedAt: new Date()
    }

    window.localStorage.setItem('projects', JSON.stringify(projectsList))
    onFinish()
  }
}

export function toggleStarredProject(id:string, onFinish: ()=>void = ()=>{}){
  const projectsList = getProjects()
  const projectIndex: number = projectsList.findIndex((item: Project)=>item._id === id)

  if(projectIndex !== -1){
    projectsList[projectIndex].starred = !projectsList[projectIndex].starred

    window.localStorage.setItem('projects', JSON.stringify(projectsList))
    onFinish()
  }

}

export function deleteProject(id:string, onFinish: ()=>void = () => {}) {
  const projectsList = getProjects()
  const projectIndex: number = projectsList.findIndex((item: Project)=>item._id === id)
  
  if(projectIndex !== -1){
    if(projectsList[projectIndex].columns?.length){
      const columnsList = getColumns()
      const columnsToDelete: Column[] = columnsList.filter((item: Column)=> projectsList[projectIndex].columns?.includes(item._id))
    
      // Suppression des tâches
      for(let index = 0; index < columnsToDelete.length; index++){
        if(columnsToDelete[index].tasks?.length){
          const tasks = getTasks()
          const newTasks: Task[] = tasks.filter((item:Task) => !columnsToDelete[index].tasks?.includes(item._id))
          
          window.localStorage.setItem('tasks', JSON.stringify(newTasks))
        }
      }

      // Suppression des colonnes
      const formattedColumnsToDelete: string[] = columnsToDelete.map((item:Column)=> item._id)
      const newColumns: Column[] = columnsList.filter((item:Column)=> !formattedColumnsToDelete.includes(item._id))

      window.localStorage.setItem('columns', JSON.stringify(newColumns))
    }

    // Suppression du projet
    projectsList.splice(projectIndex, 1)
    window.localStorage.setItem('projects', JSON.stringify(projectsList))

    onFinish()
  }
}

export function getColumns<T extends {populateTasks: boolean} = {populateTasks: false}>(options?: T): Column<T>[] {
  const fromLS: string = window.localStorage.getItem('columns') || ''
  const  parsed: Column[] = fromLS ? JSON.parse(fromLS) : []

  if(options?.populateTasks){
    const tasks = getTasks()
  
    return parsed.map((col: Column)=> {
      const filteredTasks = tasks.filter((item:Task)=> col.tasks?.includes(item._id))
      const newColumnData: Column<T> = {...col, tasks: filteredTasks} as Column<T>

      return newColumnData
    })
  }

  return parsed as Column<T>[]
}

export function getOneColumn(id: string) {
  const columnsList = getColumns()
  const matchingColumn: Column | undefined = columnsList.find((item: Column)=>item._id === id)

  return matchingColumn || null
}

export function createColumn(projectId:string, data: {name:string, description:string, color?:string, deadline?: Date}, onFinish: ()=>void = ()=>{}) {
  const columnsList = getColumns()
  const project = getOneProject(projectId)

  if(project){
    const newColumn: Column = {
      _id: uuidv4(),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(data.color ? {color: data.color} : {}),
      ...(data.deadline ? {deadline: data.deadline} : {}),
    }

    columnsList.push(newColumn)
    window.localStorage.setItem('columns', JSON.stringify(columnsList))

    const newColumnsList: string[] = [...(project.columns || []), newColumn._id]
    
    editProject(projectId, {columns: newColumnsList}, ()=>onFinish())
  }
}

export function duplicateColumn(projectId: string, columnId: string, onFinish: ()=>void = ()=>{}){
  const columnsList = getColumns()
  const matchingColumn = getOneColumn(columnId)
  const project = getOneProject(projectId)

  if(project && matchingColumn){
    const newColumn: Column = {
      ...matchingColumn,
      _id: uuidv4(),
      name: matchingColumn.name + ' - copie',
    }

    columnsList.push(newColumn)
    window.localStorage.setItem('columns', JSON.stringify(columnsList))

    const newColumnsList: string[] = [...(project.columns || []), newColumn._id]
    
    editProject(projectId, {columns: newColumnsList}, ()=>onFinish())
  }
}

export function editColumn(columnId: string, data:{name?:string, description?:string, color?:string, deadline?: Date, tasks?:string[]}, onFinish: ()=>void = ()=>{}) {
  const columnsList = getColumns()
  const columnIndex: number = columnsList.findIndex((item: Column)=>item._id === columnId)

  if(columnIndex !== -1){
    columnsList[columnIndex] = {
      ...columnsList[columnIndex],
      ...(data.name ? {name: data.name} : {}),
      ...(data.description ? {description: data.description} : {}),
      ...(data.color ? {color: data.color} : {}),
      ...(data.tasks ? {tasks: data.tasks} : {}),
      ...(data.deadline ? {deadline: data.deadline} : {}),
      updatedAt: new Date()
    }

    window.localStorage.setItem('columns', JSON.stringify(columnsList))
    onFinish()
  }
}

export function deleteColumn(projectId: string, columnId: string, onFinish: () => void = () => {}) {
  const columns = getColumns()
  const projects = getProjects()
  const projectIndex: number = projects.findIndex((item:Project)=>item._id === projectId)
  const columnIndex: number = columns.findIndex((item:Column)=> item._id === columnId)

  if(columnIndex !== -1 && projectIndex !== -1 && projects[projectIndex].columns?.length){
    const columnPosition: number = projects[projectIndex].columns?.findIndex((item: string)=> item === columnId)
    
    if(columnPosition !== -1){
      //Suppression des  tâches liées à cette colonne
      if(columns[columnIndex].tasks?.length){
        const tasks = getTasks()
        const newTasks = tasks.filter((item:Task)=> !columns[columnIndex].tasks?.includes(item._id))

        window.localStorage.setItem('tasks', JSON.stringify(newTasks))
      }

      //Suppression de la colonne dans le projet
      projects[projectIndex].columns?.splice(columnPosition, 1)
      window.localStorage.setItem('projects', JSON.stringify(projects))
      

      //Suppression de la colonne
      columns.splice(columnIndex, 1)
      window.localStorage.setItem('columns', JSON.stringify(columns))

      onFinish()
    }
  }
}

export function getTasks(): Task[] {
  const fromLS: string = window.localStorage.getItem('tasks') || ''
  const parsed: Task[] = fromLS ? JSON.parse(fromLS) : []

  return parsed
}

export function getOneTask(id: string) {
  const tasksList = getTasks()
  const matchingTask: Task | undefined = tasksList.find((item: Task)=>item._id === id)

  return matchingTask || null
}

export function createTask(columnId:string, data: {name:string, description:string, color?:string, deadline?: Date}, onFinish: ()=>void = ()=>{}) {
  const columnsList = getTasks()
  const column = getOneColumn(columnId)

  if(column){
    const newTask: Task = {
      _id: uuidv4(),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(data.color ? {color: data.color} : {}),
      ...(data.deadline ? {deadline: data.deadline} : {}),
    }

    columnsList.push(newTask)
    window.localStorage.setItem('tasks', JSON.stringify(columnsList))

    const newTasksList: string[] = [...(column.tasks || []), newTask._id]
    
    editColumn(columnId, {tasks: newTasksList}, ()=>onFinish())
    onFinish()
  }
}

export function duplicateTask(columnId: string, taskId: string, onFinish: ()=>void = ()=>{}){
  const tasksList = getTasks()
  const matchingTask = getOneTask(taskId)
  const column = getOneColumn(columnId)
  
  if(column && matchingTask){
    const newTask: Task = {
      ...matchingTask,
      _id: uuidv4(),
      name: matchingTask.name + ' - copie',
    }

    tasksList.push(newTask)
    window.localStorage.setItem('tasks', JSON.stringify(tasksList))

    const newTasksList: string[] = [...(column.tasks || []), newTask._id]
    
    editColumn(columnId, {tasks: newTasksList}, ()=>onFinish())
  }
}

export function editTask(taskId: string, data:{name?:string, description?:string, color?:string, deadline?: Date, isCompleted?: boolean}, onFinish: ()=>void = ()=>{}) {
  const tasksList = getTasks()
  const taskIndex: number = tasksList.findIndex((item: Task)=>item._id === taskId)

  if(taskIndex !== -1){
    tasksList[taskIndex] = {
      ...tasksList[taskIndex],
      ...(data.name ? {name: data.name} : {}),
      ...(data.description ? {description: data.description} : {}),
      ...(data.color ? {color: data.color} : {}),
      ...(data.deadline ? {deadline: data.deadline} : {}),
      ...(data.isCompleted ? {isCompleted: data.isCompleted, completedAt: new Date()} : {}),
      updatedAt: new Date()
    }

    window.localStorage.setItem('tasks', JSON.stringify(tasksList))
    onFinish()
  }
}

export function deleteTask(taskId: string, columnId: string, onFinish: () => void = () => {}) {
  const tasks = getTasks()
  const taskIndex: number = tasks.findIndex((item:Task)=> item._id === taskId)

  if(taskIndex !== -1){
    const columns = getColumns()
    const columnIndex: number = columns.findIndex((item:Column)=> item._id === columnId)

    if(columnIndex !== -1 && columns[columnIndex].tasks){
      const taskPosition: number = columns[columnIndex].tasks.findIndex((item: string)=>item === taskId)

      if(taskPosition !== -1){
        columns[columnIndex].tasks?.splice(taskPosition, 1)
        tasks.splice(taskIndex, 1)
    
        window.localStorage.setItem('columns', JSON.stringify(columns))
        window.localStorage.setItem('tasks', JSON.stringify(tasks))
        onFinish()
      }
    }
  }
}
