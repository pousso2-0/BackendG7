// src/controllers/ReportController.js
import ReportService from '../services/reportService.js';

class reportController {
    static async reportUser(req, res) {
        try {

            const reporterId = req.userId;
            const { reportedId, reason } = req.body;
            if (!reportedId || !reason) {
                throw new Error('Missing required fields');
            }
            if (reporterId === reportedId) {
                throw new Error('You cannot report yourself');
            }
            const report = await ReportService.reportUser(reporterId, reportedId, reason);
            res.status(201).json({ message: 'User reported successfully', report });
        } catch (error) {
            res.status(400).json({ message: `Failed to report user: ${error.message}` });
        }

    }
}

export default reportController;
