export const success = (res, data, message = 'Success') => {
  res.json({ status: 'success', message, data });
};

export const error = (res, errorMessage, code = 500) => {
  res.status(code).json({ status: 'error', message: errorMessage });
};
