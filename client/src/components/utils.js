export const isCodeCorrect = (currentCode, solutionCode) => {
  console.log(solutionCode.trim())
  return currentCode.trim() === solutionCode.trim();
};
