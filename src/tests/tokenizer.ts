import { tokenizer } from '../tokenizer';
import { promises } from 'fs';

export async function getChalkTokenizer() {
  const fileStr = await promises.readFile("./chalk/example.chalk", "utf8");
  
  return tokenizer(fileStr, false);
}