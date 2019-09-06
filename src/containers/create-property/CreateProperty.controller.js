import Axios from "axios";

import { BaseController } from "../../helpers";
import { Properties } from '../../entities';

export class CreatePropertyController extends BaseController {
  constructor({ toState, getState, getProps }) {
    super({ toState, getState, getProps });

    this.timeout = null;

    this.handleAutocomplete = this.handleAutocomplete.bind(this);
  }

  async handleAutocomplete(e) {
    const { value } = e.target;
    this.toState({ address: value })
  }
}