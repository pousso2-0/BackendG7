




import cron from 'node-cron';
import Status from '../models/Status.js';

// Tâche programmée pour supprimer les statuts expirés toutes les minutes
cron.schedule('* * * * *', async () => {
  try {
    const expirationDate = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes dans le passé
    const expiredStatuses = await Status.find({ expiresAt: { $lte: expirationDate } });

    for (const status of expiredStatuses) {
      await status.deleteOne();
      console.log(`Deleted expired status: ${status._id}`);
    }
  } catch (error) {
    console.error('Error cleaning up expired statuses:', error);
  }
});