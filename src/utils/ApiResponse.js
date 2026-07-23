class ApiResponse {
  constructor(data = {}, requestId, message = "Request completed successfully") {
    this.success = true;
    this.message = message;
    this.data = data;
    this.requestId = requestId;
  }
}

module.exports = ApiResponse;
