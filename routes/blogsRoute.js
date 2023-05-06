const express=require('express')
const router = express.Router()
const ConnectDB=require('../index')
router.get('/all', async (req, res) => {
    const db = await ConnectDB();
    const blogs=db.collection('blogs')
    res.json(blogs)
})
module.exports = router;