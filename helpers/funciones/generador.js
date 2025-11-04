export const generarID = (potencia=8) => {
    const min = 10**(potencia-1);
    const max = (10**potencia)-1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}