import axios from 'axios';

const baseURL = 'http://localhost:3000/api/messages'; 
const mamadouId = '66b3d44561ca2d08416dc46f';
const bassirouId = '66afe43ca804d6487e2bafcf';

const mamadouToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmIzZDQ0NTYxY2EyZDA4NDE2ZGM0NmYiLCJ0eXBlIjoiY2xpZW50IiwiaWF0IjoxNzIzMTIwODE4LCJleHAiOjE3MjMyMDcyMTh9.LBbdX-h7lyvK04AQqvXv1jP6RH3oAaMiDhwmXq89DiE';
const bassirouToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmFmZTQzY2E4MDRkNjQ4N2UyYmFmY2YiLCJ0eXBlIjoidGFpbGxldXIiLCJpYXQiOjE3MjMxMjA5ODUsImV4cCI6MTcyMzIwNzM4NX0.7fTYFEYI8vmfWPeVHrmzauLjtbeXwMIQWX4a35H80rU';

const sendMessage = async (senderId, receiverId, content, token) => {
  try {
    const response = await axios.post(baseURL, 
      { receiverId, content },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    console.log(`Message envoyé de ${senderId} à ${receiverId}: ${content}`);
    return response.data;
  } catch (error) {
 

    console.error('Erreur lors de l\'envoi du message:', error.response?.status, error.response?.data || error.message);
  }
};

const getMessages = async (userId, otherUserId, token) => {
  try {
    const response = await axios.get(`${baseURL}?otherUserId=${otherUserId}`, 
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log(`Messages entre ${userId} et ${otherUserId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error.response?.status, error.response?.data || error.message);
  }
};


const runTest = async () => {
  // Envoi de messages de Mamadou à Bassirou
  await sendMessage(mamadouId, bassirouId, "Bonjour Bassirou, comment allez-vous aujourd'hui ?", mamadouToken);
  await sendMessage(mamadouId, bassirouId, "J'espère que votre projet de couture avance bien.", mamadouToken);
  await sendMessage(mamadouId, bassirouId, "Je serais ravi de vous donner des conseils en couture si vous en avez besoin.", mamadouToken);
  await sendMessage(mamadouId, bassirouId, "J'ai de nouvelles idées de design que j'aimerais vous montrer.", mamadouToken);
  await sendMessage(mamadouId, bassirouId, "Pourriez-vous me dire quand vous seriez disponible pour une rencontre ?", mamadouToken);

  // Envoi de messages de Bassirou à Mamadou
  await sendMessage(bassirouId, mamadouId, "Bonjour Mamadou, je vais très bien merci !", bassirouToken);
  await sendMessage(bassirouId, mamadouId, "Mon projet avance bien, je suis ravi que vous vous intéressiez à cela.", bassirouToken);
  await sendMessage(bassirouId, mamadouId, "Vos conseils en couture seraient les bienvenus, j'accepte volontiers votre aide.", bassirouToken);
  await sendMessage(bassirouId, mamadouId, "Vos nouvelles idées de design m'intéressent beaucoup, j'ai hâte de les découvrir.", bassirouToken);
  await sendMessage(bassirouId, mamadouId, "Je suis disponible demain après-midi, cela vous conviendrait-il ?", bassirouToken);

  // Récupération des messagesc
  console.log("\nRécupération des messages pour Mamadou:");
  await getMessages(mamadouId, bassirouId, mamadouToken);

  console.log("\nRécupération des messages pour Ami:");
  await getMessages(bassirouId, mamadouId, bassirouToken);
};

runTest().catch(console.error);