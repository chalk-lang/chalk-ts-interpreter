import { getChalkTokenizer } from './tokenizer';

(async() => {
  const t = await getChalkTokenizer();
  
  let done = false, value;
  
  while (!done) {
    ({ done = false, value } = t.next());
    
    console.log(value);
  }
})();