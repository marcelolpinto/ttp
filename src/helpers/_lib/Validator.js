export default class Validator {
  static login(values) {
    const errors = {};
    const required = ['email', 'password'];

    if(!this._emailFormat(values.email)) errors.email = 'Invalid e-mail.'
    
    for(let i of required) {
      if(!values[i]) errors[i] = 'Required.';
    }
    
    return { errors, validated: !Object.keys(errors).length };
  }
  
  static createUser(values) {
    const errors = {};
    const required = ['name', 'email', 'password', 'confirm_password', 'role'];

    if(!this._emailFormat(values.email)) errors.email = 'Invalid e-mail.'
    if(values.password.length < 3) errors.password = 'Password should contain at least 3 characters.'
    if(values.password !== values.confirm_password) {
      errors.password = "Passwords doesn't match."
      errors.confirm_password = "Passwords doesn't match."
    }

    for(let i of required) {
			if(!values[i]) errors[i] = 'Required.';
    }
    
    return { errors, validated: !Object.keys(errors).length };
  }
  
  static editUser(values) {
    const errors = {};
    const required = ['name', 'email', 'role'];
    
    if(!this._emailFormat(values.email)) errors.email = 'Invalid e-mail.'

    for(let i of required) {
			if(!values[i]) errors[i] = 'Required.';
    }
    
    return { errors, validated: !Object.keys(errors).length };
  }
  
  static editUserPassword(values) {
    const errors = {};
    const required = ['password', 'confirm_password'];
    
    if(values.password.length < 3) errors.password = 'Password should contain at least 3 characters.'
    if(values.password !== values.confirm_password) {
      errors.password = "Passwords doesn't match."
      errors.confirm_password = "Passwords doesn't match."
    }

    for(let i of required) {
			if(!values[i]) errors[i] = 'Required.';
    }
    
    return { errors, validated: !Object.keys(errors).length };
  }
  
  static changePassword(values) {
    const errors = {};
    const required = ['old_password', 'password', 'confirm_password'];
    
    if(values.password.length < 3) errors.password = 'Password should have at least 3 characters.'
    if(values.password !== values.confirm_password) {
      errors.password = "Passwords doesn't match."
      errors.confirm_password = "Passwords doesn't match."
    }

    for(let i of required) {
			if(!values[i]) errors[i] = 'Required.';
    }
    
    return { errors, validated: !Object.keys(errors).length };
  }

  static editSelf(values, role) {
    const errors = {};
    const required = ['name', 'email'];
    if(role === 'user') required.push('max_calories');

    for(let i of required) {
			if(!values[i]) errors[i] = 'Required.';
    }
    
    return { errors, validated: !Object.keys(errors).length };
  }
  
  static _emailFormat(email) {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase())
  }
}