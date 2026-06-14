"use client";

import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  pdfName: string;
  excelName: string;
  description: string;
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [scriptResult, setScriptResult] = useState<string | null>(null);
  const [canParse, setParse] = useState(true);
  const [canDownload, setDownload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center">Загрузка проекта...</div>;
  }

  if (!project) {
    redirect("/my-projects");
  }

  const handleChangeInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleParse = async () => {
    setParse(false);
    try {
      const response = await fetch();
    } catch (err) {
      console.error(err);
      setParse(true);
    } finally {
      setParse(false);
      setDownload(true);
    }
  };

  const handleDownload = async () => {
    setDownload(false);
    try {
      const response = await fetch(`/api/projects/${id}/download`, { method: "POST" });
      // todo download
    } catch (err) {
      console.error(err);
      setDownload(true);
    } finally {
      setDownload(true);
    }
  };

  return (
    <div className="bg-white mx-auto">
      <div className="max-w-[1100px] mx-auto mt-[50px] flex justify-between items-center">
        <h1 className="text-[36px] font-bold uppercase">{project.title}</h1>
        <a
          href="/my-projects"
          className="text-[20px] font-normal uppercase bg-[url('/angle_bracket_left.svg')] bg-left bg-no-repeat pl-4 hover:cursor-pointer"
        >
          Мои проекты
        </a>
      </div>
      <div className="max-w-[1100px] mx-auto mt-[30px] mb-[50px] flex gap-x-[50px]">
        <div className="w-full px-[40px] py-[20px] border-2 rounded-[5px]">
          <div className="flex flex-col gap-y-[5px]">
            <p>Загрузите PDF-файл</p>
            <input
              className="sr-only"
              type="file"
              id="upload"
              name="upload"
              accept=".pdf"
              onChange={handleChangeInputText}
            />
            <label
              className="w-full py-[25px] border-2 rounded-[3px] border-dashed text-center"
              htmlFor="upload"
            >
              {file ? file.name : "Выбрать файл"}
            </label>
            <button
              className="w-full text-[14px] font-bold uppercase text-left flex gap-x-[8px] cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img
                className={isOpen ? "-rotate-90" : "rotate-180"}
                src="/angle_bracket_left.svg"
                width="8px"
              />
              Дополнительно
            </button>
            <div
              hidden={!isOpen}
              className="mt-[10px] flex flex-col gap-y-[10px]"
            >
              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">Введите количество этажей</label>
                <input
                  type="text"
                  placeholder="Например: 1, 2, 15 или “без”"
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">Заголовки по которым определяется таблица</label>
                <div className="flex gap-x-[10px]">
                  <textarea
                    readOnly
                    rows={1}
                    placeholder="Например: Номер, число, площадь, м2"
                    className="w-full min-h-[90px] border-2 rounded-[3px] px-[8px] py-[5px]"
                  />
                  <div className="flex flex-col gap-y-[20px] my-[2px]">
                    <button className="w-[120px] h-[32px] bg-black rounded-[3px] text-white font-bold text-[14px] uppercase flex justify-center py-[5px] cursor-pointer">
                      Добавить
                    </button>
                    <button className="w-[120px] h-[32px] bg-black rounded-[3px] text-white font-bold text-[14px] uppercase flex justify-center py-[5px] cursor-pointer">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Слова разделители которые прерывают таблицу
                </label>
                <div className="flex gap-x-[10px]">
                  <textarea
                    readOnly
                    rows={4}
                    placeholder={"Например:\nэкспликация\nусловные\nсхема"}
                    className="w-full min-h-[110px] border-2 rounded-[3px] px-[8px] py-[5px]"
                  />
                  <div className="flex flex-col gap-y-[20px] my-[2px]">
                    <button className="w-[120px] h-[32px] bg-black rounded-[3px] text-white font-bold text-[14px] uppercase flex justify-center py-[5px] cursor-pointer">
                      Добавить
                    </button>
                    <button className="w-[120px] h-[32px] bg-black rounded-[3px] text-white font-bold text-[14px] uppercase flex justify-center py-[5px] cursor-pointer">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  До какого слова проверять заголовок
                </label>
                <input
                  type="text"
                  placeholder="Например: 30"
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Расстояние между словами, меньше которого они считаются в
                  одном ряду
                </label>
                <input
                  type="text"
                  placeholder="Например: 3"
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Расстояние между словами, больше которого таблица считается
                  завершенной
                </label>
                <input
                  type="text"
                  placeholder="Например: 45"
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Размер шрифта, ниже которого слово “Экспликация” не
                  рассматривается, как указывающее на таблицу
                </label>
                <input
                  type="text"
                  placeholder="Например: 10"
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex justify-between items-center pr-[140px]">
                <label className="text-[16px]">
                  Предупреждать, если количество таблиц не сходится с
                  количеством найденных слов “Экспликация”
                </label>
                <input
                  type="checkbox"
                  className="w-[40px] h-[40px] rounded-[3px] px-[8px] py-[5px] cursor-pointer"
                />
              </div>
            </div>
            <button
              disabled={!(canParse || canDownload)}
              onClick={canDownload ? handleDownload : handleParse}
              className="w-[250px] h-[50px] mx-auto mt-[20px] mb-[10px] bg-black text-white text-[14px] font-bold uppercase rounded-[3px] cursor-pointer"
            >
              {canParse ? 'Выполняется...' : canDownload ? 'Скачать результат' : 'Запустить обработку'}
            </button>
          </div>
        </div>
        <div className="w-full h-full max-w-[330px] max-h-[330px] border-2 rounded-[5px] px-[24px]">
          <h1 className="mt-[15px] text-[24px] font-bold uppercase">
            Лог обработки
          </h1>
          {}
          <button className="w-[150px] h-[50px] mb-[44px] flex mx-auto justify-center items-center bg-black rounded-[3px] text-white text-[14px] font-bold uppercase break-words">
            Очистить лог
          </button>
        </div>
      </div>
    </div>
  );
}
