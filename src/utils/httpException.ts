class HttpException extends Error {
  status: number;
  message: string;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.message = message;
    const error = new Error(message);

    throw error;
  }
}

export default HttpException;
