const express = require('express');
const router = express.Router()
const signUpTemplateCopy = require('../models/SignUpModels')
const bcrypt = require('bcrypt')
const hostTemplate = require('../models/Host')
const reviewTemplate = require('../models/Review')

//GET is used to request data from a specified resource.
//POST is used to send data to a server to create/update a resource.

router.post('/LogIn', async (request, response) => {

    const { email, password } = request.body

    let user = await signUpTemplateCopy.findOne({ email })

    if (!user) { return response.status(401).json({ msg: "No such user found" }) }

    let matchPasssword = await bcrypt.compare(password, user.password)

    if (matchPasssword) {
        user = {
            fullName: user.fullName,
            email: user.email,
            password: user.password
        }
        response.json({ user })
        console.log(user)
    }
    else
        res.status(401).json({ msg: "Invalid Credentials" })

})


router.post('/Signup', async (request, response) => {


    const saltPassword = await bcrypt.genSalt(10)
    const securePassword = await bcrypt.hash(request.body.password, saltPassword)

    const signedUpUser = new signUpTemplateCopy({
        //grab the fullname from the fullname section in the body of the post request,:request.body.fullName is the syntax
        fullName: request.body.fullName,
        username: request.body.username,
        email: request.body.email,
        password: securePassword
    })
    signedUpUser.save()
        .then(data => {
            response.json(data)
        })
        .catch(error => {
            response.json(error)
        })
})

router.post('/host', async (request, response) => {


    const newPlace = new hostTemplate({
        //grab the fullname from the fullname section in the body of the post request,:request.body.fullName is the syntax
        location: request.body.location,
        title: request.body.title,
        details: request.body.details,
        price: request.body.price
    })
    newPlace.save()
        .then(data => {
            response.json(data)
        })
        .catch(error => {
            response.json(error)
        })
})
router.put('/host/:id', async (req, res) => {
    const user = await hostTemplate.findByIdAndUpdate(req.params.id,
        { liked: req.body.liked },
        { new: true }
    )
    res.send(user);
})

router.post('/review', async (request, response) => {


    const newPlace = new reviewTemplate({
        //grab the fullname from the fullname section in the body of the post request,:request.body.fullName is the syntax
        review: request.body.review,
        placeId: request.body.placeId,
        placeName: request.body.placeName,
        rating: request.body.rating
    })
    newPlace.save()
        .then(data => {
            response.json(data)
        })
        .catch(error => {
            response.json(error)
        })
})
router.get("/review", async (req, res) => {
    const detect = await reviewTemplate.find()
        .select("-__v")
        .sort("review");
    res.send(detect);
});

router.get("/search", async (req, res) => {
    const detect = await hostTemplate.find()
        .select("-__v")
        .sort("title");
    res.send(detect);
});

router.get('/signin')
module.exports = router