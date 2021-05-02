import { useState, useEffect } from "react";
import "./style.css";
import firebase from "./firebaseConnection";

export default function FireStoreLearn() {
  const [idPost, setIdPost] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [posts, setPosts] = useState([]);
  const [edit, setEdit] = useState(false);

  async function handleAdd() {
    //Forma de se cadastrar um novo documento na coleção com id 'manual'
    //do doc. Abaixo a forma de gerar id do doc automatizada
    // await firebase
    //   .firestore()
    //   .collection("posts")
    //   .doc("1245")
    //   .set({
    //     titulo: titulo,
    //     autor: autor,
    //     idade: 23  //não precisa necessariamente haver um input pra qlqr campo aqui do 'set'
    //   })
    //   .then(() => {
    //     console.log("Dados cadastrados com sucesso");
    //   })
    //   .catch((error) => {
    //     console.log("Gerou algum erro:", error);
    //   });
    await firebase
      .firestore()
      .collection("posts")
      .add({
        //com o .add, o FB já reconhece que é pra add um documento com id aleatório na collection posts
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        console.log("Dados cadastrados com sucesso");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        console.log("Gerou algum erro:", error);
      });
  }
  async function buscaPost() {
    //forma 1 de buscar dados de um doc de uma collection
    // await firebase.firestore().collection('posts')
    //   .doc('1234')
    //   .get() //vai buscar os dados do doc de id 123 na collection posts. Os dados chegam como promises
    //   .then((snapshot) => {  //chegando como promises, é devolvido tb o status de then e catch // o 'snapshot' é uma convenção, é como uma foto do que vem dentro do doc '123' no firebase
    //     console.log(snapshot.data());
    //     setTitulo(snapshot.data().titulo);
    //     setAutor(snapshot.data().autor);
    //   })
    //   .catch((error) => {
    //     console.log('Ocorreu algum erro', error)
    //   })

    //método para buscar todos os docs da collection posts. N tem o .doc
    await firebase
      .firestore()
      .collection("posts")
      .get()
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(lista);
        console.log(posts);
      })
      .catch(() => {
        console.log("Deu algum erro");
      });
  }

  async function editarPost() {
    await firebase
      .firestore()
      .collection("posts")
      .doc(idPost)
      .update({
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        console.log("dados atualizados com sucesso");
        setIdPost("");
        setTitulo("");
        setAutor("");
        setEdit(!edit);
      })
      .catch(() => {
        console.log("Erro ao atualizar");
      });
  }

  async function handleEdit(id) {
    setEdit(true);
    await firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .get()
      .then((snapshot) => {
        setIdPost(id);
        setTitulo(snapshot.data().titulo);
        setAutor(snapshot.data().autor);
      });
  }

  async function handleDelete(id) {
    await firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        alert("post excluído o/");
      });
  }

  useEffect(() => {
    async function loadPosts() {
      await firebase
        .firestore()
        .collection("posts")
        .onSnapshot((doc) => {
          let meusPosts = [];

          doc.forEach((item) => {
            meusPosts.push({
              id: item.id,
              titulo: item.data().titulo,
              autor: item.data().autor,
            });
          });
          setPosts(meusPosts);
        });
    }
    loadPosts();
  }, []);

  return (
    <>
      <h2>Banco de dados</h2>
      <div className="container">
        {edit && (
          <>
            <label>ID:</label>
            <input
              type="text"
              value={idPost}
              onChange={(e) => setIdPost(e.target.value)}
            />
          </>
        )}

        <label>Título:</label>
        <textarea
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscaPost}>Buscar post</button>
        {edit && <button onClick={editarPost}>Editar</button>}

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>ID - {post.id} </span> <br />
                <span>Titulo: {post.titulo} </span> <br />
                <span>Autor: {post.autor} </span> <br />
                <button onClick={() => handleEdit(post.id)}>Editar post</button>
                <br />
                <button onClick={() => handleDelete(post.id)}>
                  Excluir post
                </button>
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
