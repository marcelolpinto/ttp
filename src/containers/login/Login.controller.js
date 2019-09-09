import { BaseController, Validator } from '../../helpers';
import { UsersRepository } from '../../repositories';

export class LoginController extends BaseController {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    this.handleFacebookSignIn = this.handleFacebookSignIn.bind(this);

    this._authenticateSocialMedia = this._authenticateSocialMedia.bind(this);
  }



  handleChange(e, format) {
    const state = this.getState();
    return this.toState({
      ...state,
      ...this.baseHandleChange(e, format),
      errors: {
        ...state.errors,
        [e.target.id]: ''
      }
    });
  }



  async handleSubmit(e) {
    e.preventDefault();
    const { history } = this.getProps();
    const { email, password } = this.getState();

    const { errors, validated } = Validator.login({ email, password });
    if(!validated) return this.toState({ errors });

    const auth = await this.usersRepo.authenticate({ email, password });
    if(auth.err) return;

    const { user: { _id, role }, token } = auth.data;
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user_id', _id);

    const url = {
      client: `/properties`,
      manager: '/properties',
      admin: '/users'
    }[role] || '/properties';

    history.push(url);
  }



  async handleGoogleSignIn(res) {
    const { accessToken, profileObj } = res;

    if(!accessToken) throw new Error('No access token');
    
    const { email, name, imageUrl } = profileObj;
    if(email) {
      // try to find user by email
      const user = await this.usersRepo.fetchByEmail(email)

      if(user.err) {

        // if user doesn't exist, create new user in db 
        if(user.err.code === 404) {
          const newUser = await this.usersRepo.create({
            name,
            email,
            imageUrl,
            origin: 'google',
            role: 'client',
            status: 'active'
          });

          if(!newUser.err) this._authenticateSocialMedia(newUser.data._id, 'google', accessToken);  
        }
      }

      // if user exists
      else this._authenticateSocialMedia(user.data._id, 'google', accessToken);  
    }
  }



  async handleFacebookSignIn(res) {
    const { accessToken } = res;
    if(!accessToken) throw new Error('No access token');
    
    const { email, name, picture } = res;
    if(email) {
      // try to find user by email
      const user = await this.usersRepo.fetchByEmail(email);

      if(user.err) {

        // if user doesn't exist, create new user in db 
        if(user.err.code === 404) {
          const imageUrl = picture && picture.data ? picture.data.url : '';
          const newUser = await this.usersRepo.create({
            name,
            email,
            imageUrl,
            origin: 'facebook',
            role: 'client',
            status: 'active'
          });

          if(!newUser.err) this._authenticateSocialMedia(newUser.data._id, 'facebook', accessToken);  
        }
      }

      // if user exists
      else this._authenticateSocialMedia(user.data._id, 'facebook', accessToken);
    }
  }

  async _authenticateSocialMedia(user_id, origin, accessToken) {
    const auth = await this.usersRepo.authenticateSocialMedia({
      user_id, origin, accessToken
    });

    if(!auth.err) {
      window.localStorage.setItem('user_id', auth.data.user._id);
      window.localStorage.setItem('token', auth.data.token);

      const route = {
        admin: '/users'
      }[auth.data.user.role] || '/properties'
      
      this.getProps().history.push(route);
    }
  }
}