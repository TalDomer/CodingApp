import axios from 'axios';

const localhost = 'http://localhost:8081/api';

export async function getCodeBlocks() {
  const response = await axios.get(`${localhost}/codeblocks`);
  return response.data;
}

export async function getCodeBlockByName(name) {
  const response = await axios.get(`${localhost}/codeblocks/${name}`);
  return response.data;
}

export async function updateCodeBlock(name, updatedCode) {
  const response = await axios.put(`${localhost}/codeblocks/${name}`, { currentCode: updatedCode });
  return response.data;
}