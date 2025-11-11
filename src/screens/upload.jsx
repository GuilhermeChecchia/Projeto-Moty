import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // use o caminho correto do seu firebase.js
import palavras from "./palavras.json"; // o JSON deve estar na mesma pasta

export const uploadPalavras = async () => {
  try {
    // Cria/atualiza um documento único na coleção "recursos"
    await setDoc(doc(db, "recursos", "palavras"), {
      lista: palavras,
      criadoEm: new Date()
    });

    console.log("✅ Documento 'palavras' criado com sucesso!");
    alert("Documento enviado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar documento:", error);
    alert("Erro ao criar documento: " + error.message);
  }
};
