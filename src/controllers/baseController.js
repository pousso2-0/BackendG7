
class BaseController {
    static sendResponse(res, data = null, message = '', status = 200) {

      console.log("azert", res, data, message);
      res.status(status).json({ message, data });
      console.log("aert", res.status);
    }
  
    static sendErrorResponse(res, message = 'An error occurred', status = 400) {
      console.error(`Error ${status}: ${message}`);
      res.status(status).json({ message });
    }
  }
  
  export default BaseController;
  