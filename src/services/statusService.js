// src/services/statusService.js
import Status from "../models/Status.js";
import { ValidationError, DatabaseError } from "../errors/customErrors.js";

class StatusService {
  static async createStatus(userId, statusData) {
    try {
      if (!userId) {
        throw new ValidationError("User ID is missing");
      }
      const status = new Status({
        userId,
        ...statusData,
      });
      await status.save();
      return status;
    } catch (error) {
      throw new DatabaseError(`Failed to create status: ${error.message}`);
    }
  }

  static async getStatusById(statusId) {
    try {
      const status = await Status.findById(statusId).populate("userId", "name profilePicture");
      if (!status) {
        throw new ValidationError("Status not found");
      }
      return status;
    } catch (error) {
      throw new DatabaseError(`Failed to get status: ${error.message}`);
    }
  }

  static async viewStatus(statusId, userId) {
    try {
      const status = await Status.findById(statusId);
      if (!status) {
        throw new ValidationError("Status not found");
      }
      // Vérifier si l'utilisateur qui regarde le statut est le même que celui qui l'a posté
      if (status.userId.toString() !== userId) {
        if (!status.viewedBy.includes(userId)) {
          status.viewsCount++;
          status.viewedBy.push(userId);
          await status.save();
        }
      }
      return status;
    } catch (error) {
      throw new DatabaseError(`Failed to view status: ${error.message}`);
    }
  }

  static async deleteStatus(statusId, userId) {
    try {
      const status = await Status.findOneAndDelete({ _id: statusId, userId });
      if (!status) {
        throw new ValidationError("Status not found or you're not authorized to delete it");
      }
      return status;
    } catch (error) {
      throw new DatabaseError(`Failed to delete status: ${error.message}`);
    }
  }

  static async getUserStatuses(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const statuses = await Status.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name profilePicture");
      return statuses;
    } catch (error) {
      throw new DatabaseError(`Failed to get user statuses: ${error.message}`);
    }
  }
}

export default StatusService;
