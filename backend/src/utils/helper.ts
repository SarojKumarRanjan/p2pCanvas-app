const s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

export const gid  = () :string => `${s4()}-${s4()}-${s4()}-4${s4().substring(1)}`;