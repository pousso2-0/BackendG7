import userRoutes from './userRoutes.js';
import postRoutes from './postRoutes.js';
import commentRoutes from './commentRoutes.js';
import messageRoutes from './messageRoutes.js';
import feedRoutes from './feedRoutes.js';
import reactionsRoutes from './reactionsRoutes.js';
import statusRoutes from './statusRoutes.js';




export default function(app) {
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/', feedRoutes);
  app.use('/api/feed', feedRoutes);
  app.use('/api/reactions', reactionsRoutes);
  app.use('/api/status', statusRoutes);



}