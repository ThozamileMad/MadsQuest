// Returns a successful API response
const ok = (data) => ({
  success: true,
  result: data,
  statusCode: 200,
});

// Returns a 'not found' API response with provided data
const notFound = (data) => ({
  success: false,
  result: data,
  statusCode: 404,
});

// Returns a generic server error response
const serverError = (msg = "Server error") => ({
  success: false,
  result: msg,
  statusCode: 500,
});

export { ok, notFound, serverError };
