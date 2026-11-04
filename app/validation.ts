export const validateMenuItem = (name: string, desc: string, price: string) => {
  const errors: any = {};
  if (!name.trim()) errors.name = 'Dish name is required';
  if (!desc.trim()) errors.description = 'Description is required';
  const p = parseFloat(price);
  if (!price.trim()) errors.price = 'Price is required';
  else if (isNaN(p) || p <= 0) errors.price = 'Enter valid price > 0';
  return { isValid: Object.keys(errors).length === 0, errors, parsedPrice: p };
};