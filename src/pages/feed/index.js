import {
  onNavigate,
} from '../../navigate.js';
import {
  collectionPosts,
  criarPost,
  likePost,  delPost,
  updatePost,
  // eslint-disable-next-line import/named
} from '../../services/index.js';

export default () => {
  const main = document.getElementById('root');
  main.innerHTML = '';
  const feed = document.createElement('div');
  const container = `
    <section class="feed">
      <div id="burger-menu">
      <span></span>
    </div>
    <div id="menu">
        <ul>
          <li><a id="home">Home</a></li>
          <li><a href="#">Profile</a></li>
          <li><a  id="logout" href="#">Logout</a></li>
          <!--<li><button id="logout">Logout</button></li>-->
        </ul>
    </div>

  <article class="container-area">
    <div class="post-container">
      <div class="infoUser">
        <div class="imgUser"></div>
        <strong> username </strong>
      </div>
        <form clas="form-area" id="post-container">
        <textarea type="text" class="post-area" placeholder=" Vamos mudar o mundo?" name="mensagem"
          id="mensagem"></textarea>
        <button type="submit" class="post-btn" id="btn-postar">postar</button>
      </form>
    </div>
    <ul id="addPost"></ul>
  </article>

      <footer>
        <ul class="social-media-list">
          <li class="social-media-list-item">
            <a href="" class="social-media-list-item-link"><i></i></a>
          </li>
          <li class="social-media-list-item">
            <a href="" class="social-media-list-item-link"><i></i></a>
          </li>
          <li class="social-media-list-item">
            <a href="" class="social-media-list-item-link"><i></i></a>
          </li>
          <li class="social-media-list-item">
            <a href="" class="social-media-list-item-link"><i></i></a>
          </li>
        </ul>
      </footer>
    </section>
    `;

  feed.innerHTML = container;

  const logout = feed.querySelector('#logout');
  logout.addEventListener('click', () => {
    localStorage.removeItem('user');
    onNavigate('#login');
  });

  const home = feed.querySelector('#home');
  home.addEventListener('click', () => onNavigate('#feed'));

  const burgerMenu = feed.querySelector('#burger-menu');
  const overlay = feed.querySelector('#menu');
  burgerMenu.addEventListener('click', function burg() {
    this.classList.toggle('close');
    overlay.classList.toggle('overlay');
  });

  const postList = feed.querySelector('#addPost');
  const mensagem = feed.querySelector('#mensagem');
  const containerPost = feed.querySelector('#post-container');
  const addPost = (doc) => {
    
    const userId = doc.data().user_id;
    const element = document.createElement('li');
    const postTemplate = `

    <div data-post="${doc.id}" class="post-publicado">
    <textarea data-textarea="${doc.id}" class="post-publicado" id="post-publicado" disabled>${doc.data().mensagem}</textarea>
    <nav class="post-navbar">
      <button data-del="${doc.id}" class="post-navbar-btn" id="btn-del"> del
        <img src="img/trash-delete.png" data-delete alt="trash icon" width="27px"/>
      </button>
      <button class="post-navbar-btn" id="btn-edit"> edit
        <img data-edit="${doc.id}" src="img/pencil-icon.png" data-edit alt="edit-icon" class="edit-icon" width="27px">
      </button>
        <section data-section="${doc.id}" class="edit-section">
          <button data-update="${doc.id}" class="edit-section-btns">salvar</button>
          <button data-cancel="${doc.id}" class="edit-section-btns">cancelar</button>    
        </section>
      <button data-like="${doc.id}" class="post-navbar-btn" id="btn-publicar"> like
        <img src="img/heart.png" data-delete alt="trash icon" width="27px"/>
      </button>
      <p data-counter="${doc.id}">${doc.data().like.length}</p>
    </nav>
  </div>
    `;

    element.innerHTML += postTemplate;
    postList.append(element);

    const dataPost = element.querySelector(`[data-post="${doc.id}"]`);
    const delBtn = element.querySelector(`[data-del="${doc.id}"]`);
    const editBtn = element.querySelector(`[data-edit="${doc.id}"]`);
    const sectionBtn = element.querySelector(`[data-section="${doc.id}"]`);

    if (userId !== doc.data().user_id) {
      delBtn.style.display = 'none';
      editBtn.style.display = 'none';
    }

    sectionBtn.style.display = 'none';

    dataPost.addEventListener('click', (event) => {
      const {
        target,
      } = event;
      const postArea = element
        .querySelector(`[data-textarea="${doc.id}"]`);
      const getValue = postArea.value;

      if (target.dataset.del) {
        const postSelect = element.querySelector(`[data-post="${target.dataset.del}"]`);
        delPost(target.dataset.del);
        postSelect.remove();
      }

      if (target.dataset.edit) {
        sectionBtn.style.display = 'block';
        postArea.removeAttribute('disabled', '');
      }

      if (target.dataset.update) {
        updatePost(doc.id, getValue);
        postArea.setAttribute('disabled', '');
      }

      if (target.dataset.cancel) {
        postArea.setAttribute('disabled', '');
      }
      if (target.dataset.like) {
        likePost(userId, target.dataset.like)
          .then((like) => {
            const likeCount = element.querySelector(`[data-counter="${doc.id}"]`);
            likeCount.innerText = like;
          });
      }
    });
    const likesP = doc.data().like;
    const likeBtn = element.querySelector(`[data-like="${doc.id}"]`);
    if (!likesP.includes(userId)) {
      likeBtn.style.background = 'red';
    } else {
      likeBtn.style.background = 'yellow';
    }
    return element;
  };

  const loadPosts = () => {
    collectionPosts()
      .orderBy('data', 'desc')
      .get()
      .then((collection) => {
        postList.innerHTML = '';
        collection.forEach((doc) => {
          addPost(doc);
        });
      });
  };
  loadPosts();

  containerPost.addEventListener('submit', (e) => {
    e.preventDefault();
    criarPost(mensagem).then(() => {
      mensagem.value = '';
      loadPosts();
    });
  });


  return main.appendChild(feed);
};
