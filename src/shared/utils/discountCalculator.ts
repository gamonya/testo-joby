function discountCalculator(price: number, discount: number) {
  let res = price - (price * discount / 100);
  return Math.trunc(res * 100) / 100;
}

export default discountCalculator;