export const truncate_address = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const wei_to_eth = (wei: number) => {
  return wei / 1000000000000000000;
};
