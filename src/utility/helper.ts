export function getAmountFormatted(amounts: any, type: string) {
  return new Intl.NumberFormat().format(
    amounts
      .filter((x: { type: string }) => x.type === type)
      .map((x: { amount: any }) => x.amount)
      .reduce((x1: any, x2: any) => x1 + x2, 0)
      .toFixed(2)
  );
}

export function getProgress(amounts: any, type: string) {
  const upper = amounts
    .filter((x: { type: string }) => x.type === type)
    .map((x: { amount: any }) => x.amount)
    .reduce((x1: any, x2: any) => x1 + x2, 0);

  const lower = amounts
    .map((x: { amount: any }) => x.amount)
    .reduce((x1: any, x2: any) => x1 + x2, 0);

  const result = upper / lower;

  return isNaN(result) ? 0 : Math.round(result * 100);
}

export function getCurrentDate() {
  let today: Date | string = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  return today;
}
