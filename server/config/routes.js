//Update the name of the controller below and rename the file.
const quotes_controller = require("../controllers/quotes_controller.js");
const knex = require("../db/knex.js");

module.exports = function(app){

  app.get('/quotes', quotes_controller.fetchQuote);
  app.get('/quotes/:quote_id', quotes_controller.quoteAvgRating);

  app.post('/quotes/:quote_id', verityIpAddress, quotes_controller.insertQuoteRating);

}

function verityIpAddress(req, res, next){
  knex('user')
  .where('user.ip_address', req.body.ip_address)
  .then((res)=>{
    if(res.length){
      req.user_id = res[0].id; 
      next();
    }else{
      knex('user')
      .insert({
        ip_address: req.body.ip_address,
      }, '*')
      .then((res)=>{
        req.user_id = res[0].id; 
        next();
      })
    }
  })
}

