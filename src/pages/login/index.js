import { loginWithEmailAndPassword, signInWithGoogle } from '../../lib/authentication.js';
import { keepUserLogged } from '../../services/index.js';

export default () => {
  const login = document.createElement('div');
  const container = `

<section id="container-login" class="container">
  <section class="box">
    <figure class="logo">
      <img class="img" src="./img/ellas-dev-logo.png">
    </figure>
    <h3>Login</h3>
    <p id="errormsg"></p>
    <section class="box-input">
      <input type="email" id="user-email" name="usuario" placeholder="Email">
    </section>
    <section class="box-input">
      <input type="password" id="user-password" placeholder="Senha">
      <i id="verSenha" class="fa fa-eye" aria-hidden="true"></i>
    </section>
    <section class="justify-center">
      <button id="login-btn" type="password">Entrar</button>
      <p>OU</p>
      <button id="google-btn">Entrar com Google</button>
      <hr>
    </section>
    <p> Não tem uma conta?
      <a id="btn-signup" href="/#signUp"> Cadastre-se </a>
    </p>
  </section>
</section>

`;
  login.innerHTML = container;

  const loginButton = login.querySelector('#login-btn');
  loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    const inputEmail = login.querySelector('#user-email');
    const inputPassword = login.querySelector('#user-password');
    loginWithEmailAndPassword(inputEmail.value, inputPassword.value)

      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        window.location.hash = '#feed';
        localStorage.setItem('user', user.uid);
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        const errorMsg = document.querySelector('#errormsg');
        if (errorCode === 'auth/user-not-found') {
          errorMessage = 'Email incorreto. Tente novamente';
          errorMsg.innerHTML = errorMessage;
        } else if (errorCode === 'auth/wrong-password') {
          errorMessage = 'Senha incorreta. Tente novamente';
          errorMsg.innerHTML = errorMessage;
        }
        return error;
      });
    keepUserLogged();
  });

  const googleButton = login.querySelector('#google-btn');
  googleButton.addEventListener('click', (event) => {
    event.preventDefault();
    signInWithGoogle()

      .then(() => {
        window.location.hash = '#feed';
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        const errorMsg = document.querySelector('#errormsg');
        if (errorCode === 'auth/user-not-found') {
          errorMessage = 'Email incorreto. Tente novamente';
          errorMsg.innerHTML = errorMessage;
        } else if (errorCode === 'auth/wrong-password') {
          errorMessage = 'Senha incorreta. Tente novamente';
          errorMsg.innerHTML = errorMessage;
        }
        return error;
      });
    keepUserLogged();
  });

  login.querySelector('.fa-eye')
    .addEventListener('click', () => {
      const inputPassword = document.querySelector('#user-password');

      if (inputPassword.getAttribute('type') === 'password') {
        inputPassword.setAttribute('type', 'text');
      } else {
        inputPassword.setAttribute('type', 'password');
      }
    });

  return login;
};
