import { FormEvent, useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Input } from "../../components/input";
import { FiTrash } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

export function Admin() {
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textColorInput, setTextColorInput] = useState("#f1f1f1");
  const [bgColorInput, setBgColorInput] = useState("#121212");
  const [links, setLinks] = useState<LinkProps[]>([]);

  useEffect(() => {
    const linksRef = collection(db, "links");
    const queryRef = query(linksRef, orderBy("created", "asc"));

    const unsub = onSnapshot(queryRef, (snapshop) => {
      let lista = [] as LinkProps[];

      snapshop.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
        });
      });

      setLinks(lista);
    });

    return () => {
      unsub();
    };
  }, []);

  function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (nameInput === "" || urlInput === "") {
      alert("Preencha todos os campos!");
      return;
    }

    addDoc(collection(db, "links"), {
      name: nameInput,
      url: urlInput,
      bg: bgColorInput,
      color: textColorInput,
      created: new Date(),
    })
      .then(() => {
        setNameInput("");
        setUrlInput("");
        console.log("CADASTRADO COM SUCESSO!");
      })
      .catch((error) => {
        console.log(" ERRO AO CADASTRAR NO BANCO: " + error);
      });
  }

  async function handleDeleteLink(id: string) {
    const docRef = doc(db, "links", id);
    await deleteDoc(docRef);
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />

      <form
        className="flex flex-col mt-8 mb-3 w-full max-w-xl"
        onSubmit={handleRegister}
      >
        <label className="text-white font-medium my-2">Descrição do Link</label>
        <Input
          placeholder="Digite a descrição do link"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <label className="text-white font-medium my-2">Url do Link</label>
        <Input
          type="url"
          placeholder="Digite a url do link"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className="flex my-4 gap-5">
          <div className="flex gap-2">
            <label className="text-white font-medium my-2">Cor do link</label>
            <input
              className="border-4 border-amber-50"
              type="color"
              value={textColorInput}
              onChange={(e) => setTextColorInput(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <label className="text-white font-medium my-2">Fundo do link</label>
            <input
              className="border-4 border-amber-50"
              type="color"
              value={bgColorInput}
              onChange={(e) => setBgColorInput(e.target.value)}
            />
          </div>
        </section>

        {nameInput !== "" && (
          <div className="flex items-center justify-start flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
            <label className="text-white font-medium my-3">
              Veja como está ficando:
            </label>
            <article
              className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
              style={{
                marginBottom: 8,
                marginTop: 8,
                backgroundColor: bgColorInput,
              }}
            >
              <p className="font-bold" style={{ color: textColorInput }}>
                {nameInput}
              </p>
            </article>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 h-9 rounded-md text-white font-bold gep-4 flex justify-center items-center mb-7"
        >
          Cadastrar
        </button>
      </form>

      {links.map((link) => (
        <article
          key={link.id}
          className="flex items-center justify-between w-11/12 max-w-xl rounded p-3 mb-2"
          style={{ backgroundColor: link.bg, color: link.color }}
        >
          <p>{link.name}</p>
          <div>
            <button
              onClick={() => handleDeleteLink(link.id)}
              className="border border-dashed p-1 rounded bg-neutral-50"
            >
              <FiTrash size={18} color="#000" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
