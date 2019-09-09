import {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { BaseController, Validator, Formatter } from "../../helpers";
import { PropertiesRepository } from "../../repositories";
import { toast } from "react-toastify";

export class EditPropertyController extends BaseController {
  constructor({ toState, getState, getProps }) {
    super({ toState, getState, getProps });

    this.repo = new PropertiesRepository();
    
    this.timeout = null;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectAddress = this.handleSelectAddress.bind(this);
    this.handleAutocomplete = this.handleAutocomplete.bind(this);
    this.handleSetCoordinates = this.handleSetCoordinates.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const { showLoadingAction, closeLoadingAction, history } = this.getProps();
    const {
      id,
      name,
      description,
      address,
      lat,
      lng,
      bedrooms,
      area,
      price,
      placeId,
      isRented,
      realtorId
    } = this.getState();
    const values = {
      id,
      name,
      description,
      address,
      lat,
      lng,
      bedrooms,
      area,
      price,
      placeId,
      isRented,
      realtorId
    };

    const { validated, errors } = Validator.editProperty(values)
    if(!validated) return this.toState({ errors });
    
    values.area = parseInt(Formatter.number(values.area));
    values.price = parseInt(Formatter.number(values.price));
    values.bedrooms = parseInt(values.bedrooms);
    values.lat = parseFloat(values.lat);
    values.lng = parseFloat(values.lng);
    
    values.coords = { lat: values.lat, lng: values.lng };
    
    delete values.id;
    delete values.lat;
    delete values.lng;

    const token = window.localStorage.getItem('token');

    showLoadingAction();
    const promise = await this.repo.update(id, values, token);
    closeLoadingAction();

    if(!promise.err) {
      toast('Property updated.');
      return history.push(`/properties`);
    }
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

  async handleAutocomplete(e) {
    const { value } = e.target;
    this.toState({ address: value })
  }

  async handleSelectAddress(address) {
    let result;
    await geocodeByAddress(address)
    .then(results => {
      result = results[0];
      return getLatLng(results[0]);
    })
    .then(latLng => result.coords = latLng)
    .catch(error => console.error('Error', error));

    if(result) {
      this.toState({
        address: result.formatted_address,
        lat: result.coords.lat,
        editLat: result.coords.lat,
        lng: result.coords.lng,
        editLng: result.coords.lng,
        placeId: result.place_id
      });
    }
  };

  async handleSetCoordinates() {
    const { editLat, editLng, errors: stateErrors } = this.getState();
    const errors = { ...stateErrors };

    let hasError = false;
    if(!parseFloat(editLat)) {
      errors.editLat = 'Invalid value.';
      hasError = true;
    }
    if(!parseFloat(editLng)) {
      errors.editLng = 'Invalid value.'
      hasError = true;
    }

    if(!hasError) {
      this.toState({ address: '', lat: parseFloat(editLat), lng: parseFloat(editLng) });
    } else {
      this.toState({ errors });
    }
  }
}