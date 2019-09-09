import { BaseController, Validator } from '../../helpers';
import { UsersRepository } from '../../repositories';
import { toast } from 'react-toastify';

export class EditUserController extends BaseController  {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();
    
    this.handleUpload = this.handleUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReactivate = this.handleReactivate.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleUpload(e) {
    e.preventDefault();
    const { showLoadingAction, closeLoadingAction } = this.getProps();
    const { user } = this.getState();
		const { files } = e.target;
    if(!files.length) return;
    if(!files[0].type.startsWith('image')) {
      return toast('The file must be an image.')
    }
    
		const reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = async () => {
      showLoadingAction();
      const to = Array.prototype.slice.call(files).map(file => {
        return {
          data: file,
					src: URL.createObjectURL(file),
					id: URL.createObjectURL(file) + file.name
				};
      });
      
    	const form = new FormData();
      form.append('image', new Blob([to[0].data]), to[0].data.name);

      const promise = await this.usersRepo.uploadImage(user.id, form);
      if(!promise.err) {
        this.toState({ imageUrl: '' });
        this.toState({ imageUrl: promise.data.imageUrl });
      }

      closeLoadingAction();
      
		};
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
  
  handleSelect(e) {
    const { errors } = this.getState();
    const { value, name } = e.target;
    this.toState({ [name]: value, errors: { ...errors, [name]: '' } });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { showLoadingAction, history, closeLoadingAction, users, setUsersAction } = this.getProps();
    const { user, name, email, role } = this.getState();
    const values = { name, email, role };

    if(!this._hasChanged(user, values)) return toast("No modifications were made.");

    const { validated, errors } = Validator.editUser(values)
    if(!validated) return this.toState({ errors });
    
    showLoadingAction();
    const userPromise = await this.usersRepo.update(user.id, values);
    closeLoadingAction();

    if(!userPromise.err) {
      const newUsers = users.update(user.id, values);
      setUsersAction(newUsers);
      toast(`User updated successfully.`);
      history.push('/users');
    }
  }

  async handleReactivate(e) {
    e.preventDefault();
    const {
      showLoadingAction,
      history,
      closeLoadingAction,
      users,
      setUsersAction
    } = this.getProps();
    const { user } = this.getState();
    const update = { status: 'active', loginAttempts: 0 };

    showLoadingAction();
    const userPromise = await this.usersRepo.update(user.id, update);
    closeLoadingAction();

    if(!userPromise.err) {
      const newUsers = users.update(user.id, update);
      setUsersAction(newUsers);
      toast(`User reactivated successfully.`);
      history.push('/users');
    }
  }

  _hasChanged(user, values) {
    let res = false;
    ['name', 'email', 'role'].forEach(key => {
      if(user[key] !== values[key]) res = true;
    })
    return res;
  }

  async handleChangePassword(e) {
    e.preventDefault();
    const { showLoadingAction, history, closeLoadingAction } = this.getProps();
    const { user, password, confirm_password } = this.getState();
    const values = { password, confirm_password };

    const { validated, errors } = Validator.editUserPassword(values)
    if(!validated) return this.toState({ errors });

    showLoadingAction();
    const userPromise = await this.usersRepo.update(user.id, values);
    closeLoadingAction();
    if(!userPromise.err) {
      toast(`User's password updated successfully.`);
      history.push('/users');
    }
  }
}