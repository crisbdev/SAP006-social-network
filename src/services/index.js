const db = firebase.firestore();
const collectionPosts = () => db.collection('posts');
const criarPost = (text) => {
  
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

const likePost = (idUser, idPost) => db
  .collection('posts')
  .doc(idPost)
  .get()
  .then((post) => {
    const like = post.data().like;
    let updateLikes = [];
    if (like.includes(idUser)) {
      const myLike = like.slice(1, like.indexOf(idUser));
      updateLikes = myLike.length;
      db
        .collection('posts')
        .doc(idPost)
        .update({ like: firebase.firestore.FieldValue.arrayRemove(idUser) });
    } else {
      like.push(idUser);
      updateLikes = like.length;
      db
        .collection('posts')
        .doc(idPost)
        .update({ like: firebase.firestore.FieldValue.arrayUnion(idUser) });
    }
    return updateLikes;
  });

const delPost = (idPost) => db
  .collection('posts')
  .doc(idPost)
  .delete();

const updatePost = (idPost, text) => db
  .collection('posts')
  .doc(idPost)
  .update({ mensagem: text });

const getLikes = (idPost) => db
  .collection('posts')
  .doc(idPost)
  .get();

const keepUserLogged = () => firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export {
  collectionPosts, criarPost, likePost, delPost, updatePost, getLikes, keepUserLogged,
};
