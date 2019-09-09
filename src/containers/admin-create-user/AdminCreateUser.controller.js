import { BaseController, Validator } from '../../helpers';
import { UsersRepository } from '../../repositories';
import { toast } from 'react-toastify';

export class AdminCreateUserController extends BaseController  {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const { name, email, password, confirm_password, role } = this.getState();
    const values = { name, email, password, confirm_password, role };

    const { validated, errors } = Validator.createUser(values);
    if(!validated) return this.toState({ errors });

    delete values.confirm_password;
    values.origin = 'admin';
    values.status = 'active';

    showLoadingAction();
    const user = await this.usersRepo.create(values);
    closeLoadingAction();

    if(!user.err) {
      const newUsers = users.add(user.data);
      setUsersAction(newUsers);
      toast(`User created successfully.`);
      history.push('/users');
    }
  }
}