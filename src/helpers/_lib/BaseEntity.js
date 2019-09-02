import cloneDeep from 'lodash.clonedeep';
import sortBy from 'lodash.sortby';

export default class BaseEntity {
	baseAdd(newElement, original, Entity, sort = false) {
		let copy = cloneDeep(original);
    copy.unshift(newElement);
    if(sort) copy = sortBy(copy, sort).reverse();
		return new Entity(copy);
	}

	baseRemove(elementId, original, Entity, typeOfId = '_id') {
		let copy = cloneDeep(original);
		for(let i in copy) {
			if(copy[i][typeOfId] === elementId) copy.splice(i, 1);
    }
		return new Entity(copy);
	}

	baseUpdate(elementId, original, Entity, update, typeOfId = '_id', sort = false) {
		let keys = Object.keys(update);
		let copy = cloneDeep(original);
		for(let i in copy) {
			if(copy[i][typeOfId] === elementId) {
				for(let j in keys) {
					copy[i][keys[j]] = update[keys[j]];
				}
			}
    }
    if(sort) copy = sortBy(copy, i => (new Date(i.date)).getTime()).reverse();
		return new Entity(copy);
	}

	baseGetById(id, all) {
		for(let i in all) {
			if(all[i].id === id) {
				return all[i];
			}
		}
		return null;
	}
}