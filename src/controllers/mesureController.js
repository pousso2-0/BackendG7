import MesureService from '../services/mesureService.js';
import UserService from '../services/userService.js';


class MesureController {
  static async createOrUpdateMesure(req, res) {
    try {
      const mesure = await MesureService.createOrUpdateMesure(req.userId, req.body);
      res.status(201).json(mesure);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getMesure(req, res) {
    try {
      const mesure = await MesureService.getMesureByUserId(req.userId);
      res.json(mesure);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async deleteMesure(req, res) {
    try {
      const result = await MesureService.deleteMesure(req.userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default MesureController;