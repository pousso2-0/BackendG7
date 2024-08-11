// src/controllers/statusController.js
import StatusService from '../services/statusService.js';
import MessageService from '../services/messageService.js';



class StatusController {
  static async createStatus(req, res) {
    try {
      const { content, media, expiresAt } = req.body;
      const userId = req.userId; // Assurez-vous que l'utilisateur est authentifié
      const status = await StatusService.createStatus(userId, { content, media, expiresAt });
      res.status(201).json(status);
    } catch (error) {
      res.status(400).json({ message: `Failed to create status: ${error.message}` });
    }
  }

  static async getStatus(req, res) {
    try {
      const { statusId } = req.params;
      const status = await StatusService.getStatusById(statusId);
      res.status(200).json(status);
    } catch (error) {
      res.status(400).json({ message: `Failed to get status: ${error.message}` });
    }
  }

  static async viewStatus(req, res) {
    try {
      const { statusId } = req.params;
      const userId = req.userId;
      const status = await StatusService.viewStatus(statusId, userId);
      res.status(200).json(status);
    } catch (error) {
      res.status(400).json({ message: `Failed to view status: ${error.message}` });
    }
  }

  static async deleteStatus(req, res) {
    try {
      const { statusId } = req.params;
      const userId = req.userId;
      await StatusService.deleteStatus(statusId, userId);
      res.status(204).json({ message: 'Status deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: `Failed to delete status: ${error.message}` });
    }
  }

  static async getUserStatuses(req, res) {
    try {
      const userId = req.userId;
      const { page, limit } = req.query;
      const statuses = await StatusService.getUserStatuses(userId, parseInt(page), parseInt(limit));
      res.status(200).json(statuses);
    } catch (error) {
      res.status(400).json({ message: `Failed to get user statuses: ${error.message}` });
    }
  }

  static async sendMessageToStatus(req, res) {
    try {
      const userId = req.userId; // ID de l'utilisateur connecté
      const { messageContent , statusId } = req.body;

      // Obtenir les informations du statut
      const status = await StatusService.getStatusById(statusId);

      // Vérifier si le statut existe
      if (!status) {
        return res.status(404).json({ message: 'Status not found' });
      }

      // Créer le contenu du message avec l'URI du statut
      const statusUri = `${req.protocol}://${req.get('host')}/api/status/${statusId}`;
      console.log(`You can view the status here: ${statusUri}`);

      const content = `${messageContent}\n\nSee the status here: ${statusUri}`;

      // Envoyer le message au propriétaire du statut
      const newMessage = await MessageService.sendMessage(userId, status.userId, content);

      res.status(200).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
      res.status(500).json({ message: `Failed to send message: ${error.message}` });
    }
  }
}

export default StatusController;
