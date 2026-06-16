import { useState } from "react";

interface ProjectCardProps {
    id: number,
    title: string,
    pdfName: string,
    excelName: string,
    excelExists: boolean,
    excelGeneratedAt: string | null,
    description: string,
    onOpenProject: (id: number) => void,
    onDeleteProject: (id: number) => void,
    onTitleChange: (id: number, newTitle: string) => void,
}

export default function ProjectCard({id, title, pdfName, excelName, excelExists, excelGeneratedAt, description, onOpenProject, onDeleteProject, onTitleChange}: ProjectCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);

    async function handleSaveTitle() {
        if (!editTitle.trim()) return;
        const res = await fetch(`/api/projects/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: editTitle.trim() }),
        });
        if (res.ok) {
            onTitleChange(id, editTitle.trim());
        }
        setIsEditing(false);
    }

    return (
        <div className="w-[330px] h-[163px] border-[2px] rounded-[5px] flex flex-col justify-between px-[24px] py-[13px]">
            <div>
                {isEditing ? (
                    <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTitle();
                            if (e.key === "Escape") setIsEditing(false);
                        }}
                        className="text-[24px] font-bold uppercase border-b-2 outline-none w-full"
                    />
                ) : (
                    <h1
                        className="text-[24px] font-bold uppercase cursor-pointer hover:opacity-70"
                        onClick={() => { setEditTitle(title); setIsEditing(true); }}
                    >
                        {title}
                    </h1>
                )}
                <p>PDF: {pdfName}</p>
                <p>Excel: {excelExists ? "Результат.xlsx" : excelName}</p>
                {excelExists
                    ? <p>Обновлено: {new Date(excelGeneratedAt!).toLocaleString("ru-RU")}</p>
                    : <p>{description}</p>}
            </div>
            <div className="flex justify-end space-x-[5px]">
                <button
                    onClick={() => onOpenProject(id)}
                    className="w-[100px] h-[25px] bg-[#151414] rounded-[3px] text-white text-[14px] font-bold px-[16px] hover:cursor-pointer">
                    ОТКРЫТЬ
                </button>
                <button 
                    onClick={() => onDeleteProject(id)}
                    className="w-[25px] h-[25px] hover:cursor-pointer">
                    <img src="trash.svg"/>
                </button>
            </div>
        </div>
    );
}