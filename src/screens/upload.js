// src/screens/upload.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.js"; // ✅ usa o db que já existe no firebase.js
import palavras from "./palavras.json" assert { type: "json" };

const uploadPalavras = async () => {
  try {
    await setDoc(doc(db, "recursos", "palavras"), {
      lista: palavras,
      criadoEm: new Date()
    });
    console.log("✅ Documento 'palavras' criado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar documento:", error);
  }
};

uploadPalavras();
