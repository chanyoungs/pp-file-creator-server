const STATUS = {
  OK: 200, // good request
  CREATED: 201, // record created in db, may or may not send response
  NO_CONTENT: 204, // request received, no content returned
  BAD_REQUEST: 400, // client sent malformed request
  UNAUTHORISED: 401, // client is not logged in
  FORBIDDEN: 403, // client is logged in, but doesn't have appropriate permissions for page
  NOT_FOUND: 404, // page not fuond
  CONFLICT: 409, // unique constraint
  SERVER_ERROR: 500 // anything else
}

module.exports = STATUS;
