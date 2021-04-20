"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        if (!req.body.name || !req.body.seasons){
            res.status(500).send("missing information to add doctor")
        }
        else{
            Doctor.create(req.body).save()
                .then(doc =>{
                    res.status(201).send(doc)
                })
                .catch(err =>{
                    res.status(400).send(err)
                })
        }
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });
    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id)
            .then(doc => {
                if (doc != null){
                    res.status(200).send(doc)
                }
            })
            .catch(err => {
                res.status(404).send("couldn't find doctor")
            })
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        Doctor.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new:true}
            )
            .then(doc => {
                res.status(200).send(doc)
            })
            .catch(err => {
                res.status(404).send("couldnt find doctor")
            })
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findOneAndDelete({_id: req.params.id})
            .then(doc=>{
                res.status(200).send(null)
                /* => {
                console.log(doc)
                if(!doc){
                    res.status(404).send()
                }
                else{
                    res.status(200).send(null)
                } */
            })
            .catch(err=>{
                res.status(404).send()
            })
    });
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        Doctor.findById(req.params.id)
            .then(doc => {
                if (doc != null) {
                    Companion.find({doctors : { $in: req.params.id}})
                        .then(comps => {
                                res.status(200).send(comps)
                        })
                }
            })
            .catch(err => {
                res.status(404).send("couldnt find doctor")
            })

    });
    

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);
        Doctor.findById(req.params.id)
            .then(doc => {
                if (doc!= null) {
                    Companion.find({doctors : { $in: req.params.id}})
                        .then(comps => {
                            let bool = true;
                            comps.forEach(element => {
                                if (element.alive == false){
                                    bool = false;
                                }
                            });
                            if (bool == false){
                                res.status(200).send(false)
                            }
                            else {
                                res.status(200).send(true)
                            }
                        })
                }   
            })
            .catch(err => {
                res.status(404).send("couldnt find doctor")
            })
     });

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        res.status(501).send();
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        if(!req.body.name || !req.body.character || !req.body.doctors || !req.body.seasons || !req.body.alive){
            res.status(500).send("missing entry")
            return;
        }
        Companion.create(req.body).save()
            .then(comp => {
                res.status(201).send(comp)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        Companion.find({"doctors.1": { $exists: true }})
        .then(comps=>{
            res.status(200).send(comps)
        })
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id)
            .then(comp => {
                if (comp != null){
                    res.status(200).send(comp)
                }
            })
            .catch(err => {
                res.status(404).send("cant find companion")
            })
        })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        Companion.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true}
        )
            .then(comp => {
                res.status(200).send(comp)
            })
            .catch(err => {
                res.status(404).send("cant find companian")
            })
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findOneAndDelete({_id: req.params.id})
            .then( comp=>{
                res.status(200).send(null)
            }
            )
            .catch(err =>{
                res.status(404).send()
            })
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        Companion.findById(req.params.id)
            .then(comp => {
                Doctor.find({_id: {$in: comp.doctors}})
                    .then(docs => {
                        res.status(200).send(docs)
                    })
            })
            .catch(err => {
                res.status(404).send("couldnt find companian")
            })
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        Companion.findById(req.params.id)
            .then(comp => {
                Companion.find({seasons : { $in: comp.seasons},
                                _id: {$ne: comp.id}})
                    .then(comps => {
                        res.status(200).send(comps)
                    })
            })
            .catch(err => {
                res.status(404).send("couldnt find companian")
            })
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        res.status(501).send();
    });

module.exports = router;