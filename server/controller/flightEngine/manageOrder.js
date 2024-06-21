const {order, remove} = require('../../services/flightEngine/manageOrder')

const getOrder = async (req, res) =>{
    const {id} = req.params
    const data = await order(id)

    if(!data){
        return res.status(400).json(null)
    }

    res.status(200).json(data)
  }
  
  
  const deleteOrder = async (req, res) =>{
    const {id} = req.params
    const data = await remove(id)
    
    if(!data){
        return res.status(400).json(null)
    }

    res.status(200).json(data)

  }

  module.exports = {getOrder, deleteOrder}