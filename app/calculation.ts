import { MenuItem } from '../types/menu';
export const getMenuStats = (items: MenuItem[]) => {
  const total = items.length;
  const average = total ? items.reduce((s, i) => s + i.price, 0) / total : 0;
  return {
    total,
    average,
    starters: items.filter(i => i.course === 'Starter').length,
    mains: items.filter(i => i.course === 'Main Course').length,
    desserts: items.filter(i => i.course === 'Dessert').length,
  };
};