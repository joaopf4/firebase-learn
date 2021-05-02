import { useState, useEffect } from "react";
import "./style.css";
import firebase from "./firebaseConnection";
import FireStoreLearn from "./BancoDeDados";

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [nome, setNome] = useState("");
  const [user, setUser] = useState({});
  // const [userLogged, setUserLogged] = useState({});

  async function novoUsuario() {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
        console.log("cadastrado com sucesso", value);
        await firebase
          .firestore()
          .collection("users")
          .doc(value.user.uid)
          .set({
            nome: nome,
            cargo: cargo,
            status: true,
          })
          .then(() => {
            setNome("");
            setEmail("");
            setCargo("");
            setSenha("");
          });
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca, mínimo 6 caracteres");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Esse email já existe");
        }
      });
  }

  async function logout() {
    await firebase.auth().signOut();
    setUser({});
  }
  async function logar() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then(async (value) => {
        console.log(value.user);
        await firebase
          .firestore()
          .collection("users")
          .doc(value.user.uid)
          .get()
          .then((snapshot) => {
            setUser({
              nome: snapshot.data().nome,
              cargo: snapshot.data().cargo,
              status: snapshot.data().status,
              email: value.user.email,
            });
          });
      })
      .catch((error) => {
        console.log("ERRO AO LOGAR", error);
      });
  }

  // useEffect(() => {
  //   async function checkLogin() {
  //     await firebase.auth().onAuthStateChanged((user) => {
  //       if(user){
  //         setUser(true);
  //         setUserLogged({
  //           uid: user.uid,
  //           email: user.email
  //         })
  //         //se tem user logado, entra nesse if
  //       } else {
  //         setUser(false);
  //         setUserLogged({});
  //         //n tem user logado
  //       }
  //     })
  //   }
  //   checkLogin();

  // }, []);

  return (
    <div>
      <h1>ReactJS + FireBase :D</h1>
      <br />

      <div className="container">
        <label>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <label>Cargo</label>
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

      <br />
        <button onClick={logar}>Fazer Login</button>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logout}>Logout</button>
      </div>
      <br />
      <hr />
      <br />

      { Object.keys(user).length > 0  && (
        <div>
          <strong>Olá {user.nome }, seja bem vindo. Vc está logado</strong><br/>
          <strong>Cargo: </strong>{user.cargo}<br/>
          <strong>Email: </strong>{user.email}<br/>
          <strong>Status: </strong>{user.status ? 'Ativo' : 'Desativado'}<br/>
          <br/><br/>
        </div>
      ) }

      <FireStoreLearn />
    </div>
  );
}

export default App;
