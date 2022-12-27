const Data = require('../modles/dataModle');


const createData = async (req, res) => {
    try {
        
    
        if (!req.body.text) {
            res.status(400)
            throw new Error('Please Add a text Field')
        }

        const data = await Data.create({
            text: req.body.text,
            user: req.user.id
        })

        res.status(201).json(data)
    } catch (err) {
        res.status(400).json({message : err.message})
    }

}
const getData = async (req, res) => {
    
    try {
        const data =await Data.find({ user: req.user.id })
        res.status(200).json(data)
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
    
}
const updateData = async (req, res) => {
    try {
        const data = await Data.findById(req.params.id)
        if (!data) {
            res.status(401)
            throw new Error('Data not Found')
        }
        // checking for user
        if (!req.user) {
            res.status(401)
            throw new Error('User not Found')
        }
        // make sure logged user is matches the data user
        if (data.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error('User not Authorized')
        }
        const updateDatas = await Data.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        res.status(200).json(updateDatas)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
const deleteData =async (req, res) => {
    
    try {
        const data = await Data.findById(req.params.id)
        if (!data) {
            res.status(401)
            throw new Error('Data not Found')
        }
        
        if (!req.user) {
            res.status(401)
            throw new Error('User Not Found')
        }
       
        if (data.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error('User not Authorized')
        }
        await data.remove();
        res.status(200).json({
            id: req.params.id
        })
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}


module.exports = {
    createData,
    getData,
    updateData,
    deleteData
}