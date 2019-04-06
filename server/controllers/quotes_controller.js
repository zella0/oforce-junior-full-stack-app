const knex = require("../db/knex.js");
const axios = require("axios");

module.exports = {
  fetchQuote: (req, res) => {
    // fetch quote from API
    // check if exist in our db by COMPARING CONTENT
    // if true then get quote id
    // else add it to our db, then get the quote id
    // check if quote's length meets the requirement
    // if true then send it back
    // else send a json obj notifying the client to continue fetching for new quote until it is true
    axios.get("http://ron-swanson-quotes.herokuapp.com/v2/quotes")
      .then(response => {
        const fetchedQuote = response.data[0];
        switch (req.query.quoteSize) {
          case "sm":
            if (!(countWords(fetchedQuote) <= 4)) {
              return res.json({
                isCorrectLength: false
              });
            }
            break;
          case "md":
            if (!(countWords(fetchedQuote) >= 5 && countWords(fetchedQuote) <= 12)) {
              return res.json({
                isCorrectLength: false
              });
            }
            break;
          case "lg":
            if (!(countWords(fetchedQuote) >= 13)) {
              return res.json({
                isCorrectLength: false
              });
            }
            break;
        }

        knex("quote")
          .where("quote.content", fetchedQuote)
          .then(quote => {
            if (!quote.length) {
              knex("quote")
                .insert({
                  content: fetchedQuote
                }, "*")
                .then(addedQuote => {
                  res.json(addedQuote);
                });
            } else {
              res.json(quote);
            }
          })
      });
  },
  quoteAvgRating: (req, res) => {
    knex('user_has_quote')
    .where('user_has_quote.quote_id', req.params.quote_id)
    .avg('rating')
    .then((quoteAvgRating)=>{
      res.json({ quoteAvgRating: quoteAvgRating[0].avg });
    })
  },
  insertQuoteRating: (req, res) => {
      knex('user_has_quote')
      .insert({
        user_id: req.user_id,
        quote_id: req.params.quote_id,
        rating: req.body.rating
      }).catch(err => {
        knex('user_has_quote')
        .where('user_has_quote.user_id', req.user_id)
        .andWhere('user_has_quote.quote_id', req.params.quote_id)
        .update({
          rating: req.body.rating
        }).then(()=>{
          res.json({ message: 'Rating sucessfully updated!' })
        })
      })
      .then(()=>{
        res.json({ message: 'Rating sucessfully updated!' })
      }).catch((err)=>{
        throw err;
      })
  }
};

function countWords(str) {
  return str.split(/\s+/).length;
}
