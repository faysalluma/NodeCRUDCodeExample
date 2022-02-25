const Thing = require('../models/thing');
// fs for file system :  get acces for informations about files systems
const fs = require('fs');

/* // Create Thing without file upload
exports.createThing = (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
      ...req.body // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
  });
  thing.save()
      .then(() => res.status(201).json({message : 'Objet enregistré !'}))
      .catch(error => res.status(400).json({error}));
} */

// Export functions to imports them in route
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  thing.save()
      .then(() => res.status(201).json({message : 'Objet enregistré !'}))
      .catch(error => res.status(400).json({error}));
}

exports.modifyThing = (req, res, next) =>{
  const thingObject = req.file ?
  {
    ...JSON.parse(req.body.thing),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Thing.updateOne({_id: req.params.id}, {...thingObject, _id : req.params.id})
      .then(() => res.status(200).json({message : 'Objet modifié !'}))
      .catch(error => res.status(400).json({error}));
}

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }).then(
    (thing) => {
      if (!thing) {
        /* res.status(404).json({
          error: new Error('No such Thing!')
          
        }); */
        return res.status(404).json({error : 'No such Thing!'});
      }
      if (thing.userId !== req.auth.userId) {
        /* res.status(400).json({
          error: new Error('Unauthorized request!')
        }); */
        return res.status(400).json({error : 'Unauthorized request!'});
      }

      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    }
  )
  .catch(error => res.status(500).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({_id : req.params.id})
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({error}));
}

exports.getAllThing = (req, res, next) => {
  Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({error}));
}


