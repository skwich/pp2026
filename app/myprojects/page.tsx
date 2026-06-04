'use client';

import { useState } from "react";
import ProjectCard from "./projectCard";

interface Project {
    id: number,
    title: string,
    pdfName: string,
    excelName: string,
    description: string
}



export default function MyProjectsPage() {
    const [projects, setProject] = useState<Project[]>([
        {id: 1, title: "Проект", pdfName:"не загружен", excelName:"не сформирован", description:"Черновик"},
        {id: 2, title: "Проект2", pdfName:"не загружен", excelName:"не сформирован", description:"Черновик"},
        {id: 3, title: "Проект3", pdfName:"не загружен", excelName:"не сформирован", description:"Черновик"},
        {id: 4, title: "Проект4", pdfName:"не загружен", excelName:"не сформирован", description:"Черновик"},
    ]);

    const [searchQuery, setSearchQuery] = useState<string>("");

    function handleAddProject() {
        const maxId = projects.length > 0 ? Math.max(... projects.map(p => p.id)) : 0;
        const newId = maxId + 1;
        const newProject: Project = {
            id: newId,
            title: `Проект${newId}`,
            pdfName: "не загружен",
            excelName: "не сформирован",
            description: "Черновик",
        };

        setProject([... projects, newProject]);
    }

    function handleOpenProject(id: number) {
        alert(`open project with id: ${id}`);
    }

    function handleDeleteProject(id: number) {
        setProject(projects.filter(project => project.id !== id));
    }

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white flex">
            <div className="px-[90px] py-[50px] w-full flex flex-col space-y-[44px]">
                <div className="w-full max-w-[1100px] mx-auto">
                    <h1 className="text-[36px] font-bold uppercase">Мои проекты</h1>
                    <div className="flex space-x-[17px]">
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск..."
                            className="border-b-1 border-[#D9D9D9] outline-none"
                        />
                        <label className="w-full flex">
                            Сортировать по:
                            {/* <img src="arrow_down.svg" width="10px" height="6px" className="ml-[4px] mr-[1px] pt-[5px]"/>
                            <select className="appearance-none outline-none"> */}
                            <select className="appearance-none bg-[url(/arrow_down.svg)] bg-no-repeat bg-[25px] pl-4 bg-[length:10px_6px] bg-[position:4px_12px] outline-none">
                                <option value="дате изменения">дате изменения</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[55px]  gap-y-[30px]">
                    {
                        filteredProjects.map((project) => (
                            <ProjectCard 
                                key={project.id}    
                                id={project.id}
                                title={project.title}
                                pdfName={project.pdfName}
                                excelName={project.excelName}
                                description={project.description}
                                onOpenProject={handleOpenProject}
                                onDeleteProject={handleDeleteProject}
                            />
                        ))
                    }
                    {
                        searchQuery.trim() === "" && (
                            <button 
                            onClick={() => handleAddProject()}
                            className="w-[330px] h-[163px] border-[2px] rounded-[5px] text-[20px] font-bold uppercase"
                            >
                                + Новый проект
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}