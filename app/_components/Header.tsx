'use client'

import { Project } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header () {
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false)

  useEffect(()=> {
    const fromLS = window.localStorage.getItem('projects')
    const parsed = fromLS ? JSON.parse(fromLS) : []

    setProjectsList(parsed)
  },[])

  return (
    <nav className="bg-black text-white flex w-full justify-between px-[10%] py-5 items-center">
      <p className="text-2xl">Trello like</p>
      <ul className="flex gap-6 text-lg">
        <li className="hover:text-red-300 cursor-pointer"><Link href="/">Accueil</Link></li>
        <li className="relative">
          <button className="cursor-pointer hover:text-red-300" onClick={()=>setIsDropdownVisible(!isDropdownVisible)} type="button">Projets</button>
          {isDropdownVisible && <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden">
            <div className="py-1">
              {projectsList?.map((item)=><Link onClick={()=>setIsDropdownVisible(false)} key={item._id} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" href={`/${item._id}`}>{item.name}</Link>)}
            </div>
          </div>}
        </li>
      </ul>
    </nav>
  )
}
