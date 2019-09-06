import sortBy from 'lodash.sortby';
import moment from 'moment';

import { BaseController } from "../../helpers";
import { Properties } from '../../entities';

export class PropertiesController extends BaseController {
  constructor({ toState, getState, getProps }) {
    super({ toState, getState, getProps });
  }
}