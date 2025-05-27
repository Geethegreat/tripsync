// server/index.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


const trips = {};

app.get('/', (req, res) => {
  res.send('TripTrio backend is live!');
});


app.post('/sign-up', (req, res) =>{
  const {name, email, passoword} = req.body; 


  console.log(name, email, passoword);
});


app.post('/update-trip', (req, res) => {
  const updatedTrip = req.body;
  console.log(updatedTrip);

  if (!updatedTrip.id) {
    return res.status(400).json({ error: 'Trip ID is required' });
  }

  const existingTrip = trips[updatedTrip.id];

  if (!existingTrip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  // Merge updates
  trips[updatedTrip.id] = {
    ...existingTrip,
    ...updatedTrip,
  };

  console.log('Updated trip:', trips[updatedTrip.id]);
  res.status(200).json({ message: 'Trip updated successfully', trip: trips[updatedTrip.id] });
});


app.post('/create-trip', (req, res) =>{
 const newTrip = req.body;

  if (!newTrip.id) {
    return res.status(400).json({ error: 'Trip must have an id' });
  }

  trips[newTrip.id] = newTrip;

  console.log('Created trip:', newTrip);
  res.status(201).json({ message: 'Trip created successfully', trip: newTrip });
});

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
