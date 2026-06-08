interface ProjectCardProps {
    id: number,
    title: string,
    pdfName: string,
    excelName: string,
    description: string,
    onOpenProject: (id: number) => void,
    onDeleteProject: (id: number) => void
}

export default function ProjectCard({id, title, pdfName, excelName, description, onOpenProject, onDeleteProject}: ProjectCardProps) {
    return (
        <div className="w-[330px] h-[163px] border-[2px] rounded-[5px] flex flex-col justify-between px-[24px] py-[13px]">
            <div>
                <h1 className="text-[24px] font-bold uppercase">{title}</h1>
                <p>PDF: {pdfName}</p>
                <p>Excel: {excelName}</p>
                <p>{description}</p>
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