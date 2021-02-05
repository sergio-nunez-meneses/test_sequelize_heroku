const db = require('../models/index');
const ash = require('express-async-handler');
const express = require('express');
const router = express.Router();

router.get('/', ash(async function(req, res, next) {
  const newFarm = await db.Farm.create({
    name: 'My other farm',
    address: '987, in a amawing street',
    city: 'Dijon',
    coordinates: '47.323662, 5.027714'
  });

  const newFarmer = await db.Farmer.create({
    name: 'Brian Doe',
    email: 'brian.doe@farmer.com',
    phone: '07 87 65 43 21'
  });

  await newFarm.addFarmer(newFarmer);
  await newFarmer.addFarm(newFarm);

  const farm = await db.Farm.findOne({
    where: { name: 'My other farm' },
    include: db.Farmer
  });
  // console.log(farm.Farmers);

  const farmer = await db.Farmer.findOne({
    where: { name: 'Brian Doe' },
    include: db.Farm
  });
  // console.log(farmer.Farms);

  console.log(await farm.hasFarmer(farmer));

  const farms = await db.Farm.findAll();
  // console.log(farms);

  if (farms == null) {
    console.error(error);
  }

  // res.render('index', {
  //   farmers: farms
  // });

  res.send({ farm: farm, farmer: farmer })
}));

module.exports = router;
