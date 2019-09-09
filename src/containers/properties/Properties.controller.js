import { BaseController } from "../../helpers";
import { Properties } from '../../entities';
import { PropertiesRepository } from '../../repositories/_lib/Properties.repository';
import { toast } from 'react-toastify';

export class PropertiesController extends BaseController {
  constructor({ toState, getState, getProps }) {
    super({ toState, getState, getProps });

    this.repo = new PropertiesRepository();

    this.fetch = this.fetch.bind(this);
    this.handleDeleteProperty = this.handleDeleteProperty.bind(this);
  }

  async fetch() {
    const token = window.localStorage.getItem('token');

    const query = `token=${token}`;

    const properties = await this.repo.list(query);

    if(!properties.err) {
      const { setPropertiesAction } = this.getProps();
      const newProperties = new Properties(properties.data);
      
      setPropertiesAction(newProperties);
    }
  }
  
  async handleDeleteProperty(propertyId) {
    const {
      setPropertiesAction,
      properties,
      showLoadingAction,
      closeLoadingAction,
      closeModalAction
    } = this.getProps();

    const token = window.localStorage.getItem('token');

    showLoadingAction();
    const promise = await this.repo.remove(propertyId, token);
    closeLoadingAction();

    if(!promise.err) {
      closeModalAction();

      const newProperties = properties.remove(propertyId);
      setPropertiesAction(newProperties);

      toast('Property deleted successfully.')
    }
  }
  
}