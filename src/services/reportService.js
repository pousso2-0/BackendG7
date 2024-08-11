// src/services/ReportService.js
import Report from '../models/Report.js';
import User from '../models/User.js';
import NotificationService from './notificationService.js';

class ReportService {
  static async reportUser(reporterId, reportedId, reason) {
    const existingReport = await Report.findOne({ signaler: reporterId, signaled: reportedId });

    console.log("existingReport", existingReport);

    if (existingReport) {
      throw new Error('User has already been reported by you');
    }

    const validReasons = ['spam', 'harassment', 'hate speech', 'fake profile', 'other'];
    if (!reason.every(reason => validReasons.includes(reason))) {
      throw new Error('Invalid reasons provided');
    }


    const report = await Report.create({
      signaler: reporterId,
      signaled: reportedId,
      reasons: reason
    });

    const blockThreshold = 5;
    const notifyThreshold = 3;

    const user = await User.findByIdAndUpdate(
      reportedId,
      { $inc: { reportCount: 1 } },
      { new: true }
    );
    // console.log("doit etre bloquer:" , user.reportCount >= blockThreshold);
    // console.log("doit etre alerter:" , user.reportCount >= notifyThreshold);


    if (user.reportCount >= blockThreshold) {
      await User.findByIdAndUpdate(reportedId, { isBlocked: true });
    } else if (user.reportCount >= notifyThreshold) {

      const message = `Your account has been temporarily blocked due to multiple reports. Please review your account and report any issues you may have encountered.`;
      // console.log(message);

       await NotificationService.sendNotification(reportedId,message);

    }
    return report;
  }
}

export default ReportService;
