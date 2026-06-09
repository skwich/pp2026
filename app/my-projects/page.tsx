"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./projectCard";

interface Project {
  id: number;
  title: string;
  pdfName: string;
  excelName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyProjectsPage() {
  const [projects, setProject] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProject(data));
  }, []);

  const [sortBy, setSortBy] = useState<"updatedAt" | "createdAt">("updatedAt");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedProjects = [...filteredProjects].sort((a,b) => {
    // const dir = sortOrder === "desc" ? -1 : 1;
    const dir = -1; // desc
    return dir * (new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime());
  });

  async function handleAddProject() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const project = await res.json();
    setProject((prev) => [...prev, project]);
  }

  async function handleDeleteProject(id: number) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProject((prev) => prev.filter((p) => p.id !== id));
  }

  function handleOpenProject(id: number) {
    alert(`open project with id: ${id}`);
  }

  return (
    <div className="bg-white flex">
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
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none bg-[url(/arrow_down.svg)] bg-no-repeat pl-4 bg-[length:10px_6px] bg-[position:4px_12px] outline-none">
                <option value="updatedAt">дате изменения</option>
                <option value="createdAt">дате создания</option>
              </select>
            </label>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[55px]  gap-y-[30px]">
          {sortedProjects.map((project) => (
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
          ))}
          {searchQuery.trim() === "" && (
            <button
              onClick={() => handleAddProject()}
              className="w-[330px] h-[163px] border-[2px] rounded-[5px] text-[20px] font-bold uppercase"
            >
              + Новый проект
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
