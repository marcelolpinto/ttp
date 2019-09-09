import { BaseController, Validator } from '../../helpers';
import { UsersRepository } from '../../repositories';
import { toast } from 'react-toastify';
import { User } from '../../entities';

export class SettingsController extends BaseController  {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();
    
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleUpload(e) {
    e.preventDefault();
    const {
      self,
      setSelfAction,
      showLoadingAction,
      closeLoadingAction,
      clearHeaderImageAction,
      restoreHeaderImageAction,
    } = this.getProps();
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

      clearHeaderImageAction();
      const promise = await this.usersRepo.uploadImage(self.id, form);
      restoreHeaderImageAction();
      if(!promise.err) {
        this.toState({ imageUrl: '' });
        this.toState({ imageUrl: promise.data.imageUrl });

        const newSelf = self.updateImage(promise.data.imageUrl); 
        setSelfAction(newSelf);
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

  async handleSubmit(e) {
    e.preventDefault();
    let { name, email } = this.getState();
    const values = { name, email };
    const {
      self,
      users,
      setSelfAction,
      setUsersAction,
      showLoadingAction,
      closeLoadingAction
    } = this.getProps();

    const { errors, validated } = Validator.editSelf(values, self.role);
    if(!validated) return this.toState({ errors });

    showLoadingAction();
    const newUser = await this.usersRepo.update(self.id, values);
    closeLoadingAction();

    if(!newUser.err) {
      const newSelf = new User({ ...self.original, ...values });
      setSelfAction(newSelf);

      if(self.role === 'admin') {
        const newUsers = users.update(self.id, values);
        setUsersAction(newUsers);
      }
      
      toast('Update successful');
    }
  }

  async handleChangePassword(e) {
    e.preventDefault();
    const { self, showLoadingAction, closeLoadingAction } = this.getProps();
    const { old_password, password, confirm_password } = this.getState();
    const values = { old_password, password, confirm_password };

    const { validated, errors } = Validator.changePassword(values)
    if(!validated) return this.toState({ errors });
    
    delete values.confirm_password;
    showLoadingAction();
    const userPromise = await this.usersRepo.changePassword(self.id, values);
    closeLoadingAction();
    if(!userPromise.err) toast('Password updated successfully.');
  }
}