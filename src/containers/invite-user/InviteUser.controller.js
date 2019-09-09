import { BaseController, Validator } from '../../helpers';
import { UsersRepository } from '../../repositories';
import { toast } from 'react-toastify';

export class InviteUserController extends BaseController  {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.toState({ errors: {} });
    const token = window.localStorage.getItem('token');
    const { showLoadingAction, closeLoadingAction, users, setUsersAction } = this.getProps();
    const { email, role } = this.getState();

    const { validated, errors } = Validator.inviteUser({ email });
    if(!validated) return this.toState({ errors });
    
    showLoadingAction();
    const promise = await this.usersRepo.sendInvitation({ email, role }, token);
    closeLoadingAction();

    if(!promise.err) {
      const newUsers = users.add(promise.data);
      setUsersAction(newUsers);

      toast(`Invitation sent.`);
      this.toState({ email: '', role: 'client' });
    }
  }
}