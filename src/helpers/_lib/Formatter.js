export default class Formatter {
  static number(text) {
    let number = '';
		for (let i in text) {
			const n = text[i];
			if (parseInt(n) || parseInt(n) === 0) number += n;
    }
		return number;
  };

  static numberAllowDots(text) {
    let number = '';
		for (let i in text) {
      const n = text[i];
      if (parseInt(n) || parseInt(n) === 0 || n === '.' || n === '-') number += n;
    }
    
		return number;
  };

  static numberWithCommas(text) {
    if (!text) return '';
		text = text.toString();
		const number = this.number(text).split('').reverse().join('');
    
		var withCommas = '';
		for (var i in number) {
			if (i % 3 === 0 && i > 2) withCommas += ',';
			withCommas += number[i];
		}
		return withCommas.split('').reverse().join('');
  };
  
  static money(amount) {
    if(!amount) amount = 0;
		return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}
}