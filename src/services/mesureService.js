// src/services/mesureService.js
import Mesure from '../models/Mesure.js';
import User from '../models/User.js';
import { ValidationError, DatabaseError } from '../errors/customErrors.js';

class MesureService {
  static async createOrUpdateMesure(userId, mesureData) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new ValidationError("User not found");
      if (user.type !== 'client') throw new ValidationError("Only clients can enter measurements");

      const allowedMesures = user.gender === 'man' 
        ? ['taille', 'tourTaille', 'largeurEpaules', 'tourCuisse', 'tourBras']
        : ['taille', 'tourPoitrine', 'tourHanche', 'tourBras'];

      const filteredMesureData = Object.keys(mesureData)
        .filter(key => allowedMesures.includes(key))
        .reduce((obj, key) => {
          obj[key] = mesureData[key];
          return obj;
        }, {});

      const existingMesure = await Mesure.findOne({ userId });
      if (existingMesure) {
        Object.assign(existingMesure, filteredMesureData);
        await existingMesure.save();
        return existingMesure;
      } else {
        const newMesure = new Mesure({ userId, ...filteredMesureData });
        await newMesure.save();
        return newMesure;
      }
    } catch (error) {
      throw new DatabaseError(`Mesure creation/update failed: ${error.message}`);
    }
  }

  static async getMesureByUserId(userId) {
    try {
      const mesure = await Mesure.findOne({ userId });
      if (!mesure) throw new ValidationError("Mesures not found for this user");
      return mesure;
    } catch (error) {
      throw new DatabaseError(`Mesure retrieval failed: ${error.message}`);
    }
  }

  static async deleteMesure(userId) {
    try {
      const result = await Mesure.findOneAndDelete({ userId });
      if (!result) throw new ValidationError("Mesures not found for this user");
      return { success: true, message: "Mesures deleted successfully" };
    } catch (error) {
      throw new DatabaseError(`Mesure deletion failed: ${error.message}`);
    }
  }
  static filterMesuresByGender(mesures, gender) {
    const allowedMesures = gender === 'man' 
      ? ['taille', 'tourTaille', 'largeurEpaules', 'tourCuisse', 'tourBras']
      : ['taille', 'tourPoitrine', 'tourHanche', 'tourBras'];

    return Object.keys(mesures.toObject())
      .filter(key => allowedMesures.includes(key) && mesures[key] !== 0)
      .reduce((obj, key) => {
        obj[key] = mesures[key];
        return obj;
      }, {});
  }

}

export default MesureService;