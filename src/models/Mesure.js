// src/models/Mesure.js
import mongoose from 'mongoose';

const mesureSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  taille: { type: Number, default: 0 },
  tourPoitrine: { type: Number, default: 0 },
  tourTaille: { type: Number, default: 0 },
  tourHanche: { type: Number, default: 0 },
  longueurDos: { type: Number, default: 0 },
  largeurEpaules: { type: Number, default: 0 },
  longueurManche: { type: Number, default: 0 },
  tourCou: { type: Number, default: 0 },
  longueurJambe: { type: Number, default: 0 },
  tourCuisse: { type: Number, default: 0 },
  tourBras: { type: Number, default: 0 }
}, { timestamps: true });

const Mesure = mongoose.model('Mesure', mesureSchema);

export default Mesure;