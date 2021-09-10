const db = firebase.firestore();
// COLEÇÃO DE POSTS
const collectionPosts = () => db.collection('posts');
// CRIAÇÃO DE POSTS
const criarPost = (text) => {
  // USUÁRIO
  const usuario = firebase.auth().currentUser;

  const post = {
    user_id: usuario.uid,
    mensagem: text.value,
    data: new Date(),
    like: [],
    comentario: [],
  };

  return collectionPosts().add(post);
};
const authState = localStorage.getItem('user');
// like post
const likePost = (idUser, idPost) => db
  .collection('posts')
  .doc(idPost)
  .get()
  .then((post) => {
    let like = post.data().like;
    if (like.includes(idUser)) {
      like = like.filter((id) => id !== idUser);
    } else {
      like.push(idUser);
    }
    return db
      .collection('posts')
      .doc(idPost)
      .update({ like })
      .then(() => like);
  })
  .catch('error');
// delete posts
const delPost = (idPost) => db
  .collection('posts')
  .doc(idPost)
  .delete();
// edit posts
const updatePost = (idPost, text) => db
  .collection('posts')
  .doc(idPost)
  .update({ mensagem: text });
// get likes
const getLikes = (idPost) => db
  .collection('posts')
  .doc(idPost)
  .get();

export {
  collectionPosts, criarPost, authState, likePost, delPost, updatePost, getLikes,
};
