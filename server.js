'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());


//server
//localhost:3030/
app.get('/',test)
app.get('/getData',pokiData)
app.post('/favData',favData)
app.get('/getFavData',getFavData)
// app.delete('/deleteFunc/:index',deleteFunc)
app.delete('/deleteFunc',deleteFunc)
app.put('/updateFavData/:index',updateFavData)


//mongo
const mongoose = require('mongoose');
const { query } = require('express');
// mongoose.connect('mongodb://localhost:27017/poki', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://Ahmad-Sailik:Ahmad4321@can-book-shard-00-00.gjuvo.mongodb.net:27017,can-book-shard-00-01.gjuvo.mongodb.net:27017,can-book-shard-00-02.gjuvo.mongodb.net:27017/poki?ssl=true&replicaSet=atlas-6wqbv4-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const pokiSchema = new mongoose.Schema({
    name:String,
    url:String,
});
const pokiModel=mongoose.model('poki',pokiSchema)

//function
function test(req,res){
    res.send('hello iam in rout')
}

function pokiData(req,res){
    const URL=`https://pokeapi.co/api/v2/pokemon`
    axios.get(URL).then(dataPoki=>{
        res.send(dataPoki.data.results)
    })
}

function favData(req,res){
    const {name,url}=req.body;
    const item=new pokiModel({
        name:name,
        url:url,
    })
    item.save()
}

function getFavData (req,res){
    pokiModel.find({},(err,data)=>{
        res.send(data);
    })
}

function deleteFunc(req,res){
    const {id} = req.query;
    pokiModel.deleteOne({_id:id},(err,data)=>{
        pokiModel.find({},(err,data)=>{
            res.send(data);
        }) 
    })
    
}
function updateFavData(req,res){
    const {name,url,id}=req.body
    const index =Number(req.params.index)
    pokiModel.find({},(err,data)=>{
        data[index].name=name;
        data[index].url=url;
        data[index].save()
        .then(()=>{
            pokiModel.find({},(err,data)=>{
                res.send(data);
            })
        })
    })
    
   
    
    
   
   
   
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));