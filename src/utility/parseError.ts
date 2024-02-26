export const parseError = (code: number) => {
  const symbol = code.toString()[0];
  switch (symbol) {
    case "4":
      return "the request contains bad syntax or cannot be fulfilled";
    case "5":
      return "the server failed to fulfil an apparently valid request";
    default:
      return "An error has occurred";
  }
};
