export const getId = (string: string, ...prefix: string[]) => {
    return prefix.join() + string.toLowerCase().replace(/[ +]/g, "");
};
