const express = require('express');
const {asyncMiddleware} = require('../utils/asyncMiddleware');
const uniqid = require('uniqid');
const router = express.Router();


// List existing Polls
router.get('/populate',  asyncMiddleware(async (req, res, next) => {
    let client = await req.db

    // Fake Polls with fake votes
    let poll_A ={
        "title": "What's your favourite color?",
        "description": "Description with less than 400 words",
        "options": [
            "Blue",
            "Red",
            "Green",
            "Orange"
        ],
        "multipleOption": true,
        "blockNumber": 12026824,
        "id": "4rthjohj8km80jpag",
        "startDate": "2021/04/20",
        "endDate": "2021/04/21",
        "votes": [
            {
                "wallet": "0x86772b1409b61c639eaac9ba0acfbb6e238e5f83",
                "balance": 50,
                "options": [
                    1,
                    2
                ]
            },{
                "wallet": "0x82edc8b237b345c8eeabed38969978e3794fa595",
                "balance": 100,
                "options": [
                    1,
                    3
                ]
            },{
                "wallet": "0xdfcb35b85fde19aa2bc2612bbdec446ba8a3ae45",
                "balance": 25,
                "options": [
                    0
                ]
            }
        ],
        "started": true,
        "finished": false
    }
    await client.put(poll_A)


    // Fake Polls with fake votes
    let poll_B ={
        "title": "How old are you??",
        "description": "Description with less than 400 words",
        "options": [
            "Very Young",
            "Young",
            "Average",
            "Old",
            "Very Old"
        ],
        "multipleOption": false,
        "blockNumber": 12026824,
        "id": "bbff6tejs66nsleole",
        "startDate": "2021/05/20",
        "endDate": "2021/05/21",
        "votes": [],
        "started": true,
        "finished": false
    }
    await client.put(poll_B)


    // Fake Polls with fake votes
    let poll_C ={
        "title": "Who is your best friend?",
        "description": "Description with less than 400 words",
        "options": [
            "Buzz",
            "Andy",
            "Woody",
            "T-rex"
        ],
        "multipleOption": false,
        "blockNumber": 12026824,
        "id": "4rthjo99rkmizse37",
        "startDate": "2021/03/20",
        "endDate": "2021/03/21",
        "votes": [
            {
                "wallet": "0x86772b1409b61c639eaac9ba0acfbb6e238e5f83",
                "balance": 50,
                "options": [
                    1
                ]
            },{
                "wallet": "0x82edc8b237b345c8eeabed38969978e3794fa595",
                "balance": 100,
                "options": [
                    2
                ]
            },{
                "wallet": "0xdfcb35b85fde19aa2bc2612bbdec446ba8a3ae45",
                "balance": 25,
                "options": [
                    0
                ]
            }
        ],
        "started": true,
        "finished": false
    }
    await client.put(poll_C)


    res.status(200).send([poll_A, poll_B, poll_C]);

}))

module.exports = router;

