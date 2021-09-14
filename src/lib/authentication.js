const auth = firebase.auth();

// funções de login para criar conta chamar onnavigate
const loginWithEmailAndPassword = (email, password) => auth
  .signInWithEmailAndPassword(email, password);

// FUNÇÃO DE LOGIN COM GOOGLE
const signInWithGoogle = () => {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(googleProvider);
};

function cadastrarsenha(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}
export { loginWithEmailAndPassword, signInWithGoogle, cadastrarsenha}