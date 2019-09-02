export default class Formatter {
  static number(text) {
    let number = '';
		for (let i in text) {
			const n = text[i];
			if (parseInt(n) || parseInt(n) === 0) number += n;
    }
		return number;
	};
}