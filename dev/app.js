require('dotenv').config()
const { default: Axios } = require('axios');
const express = require('express')
const passport = require('passport');
const CryptrStrategy = require('../lib/strategy');
const axios = require('axios')
const app = express()
const port = 4242

// set the view engine to ejs
app.set('view engine', 'ejs');

const token_1 = "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L3NoYXJrLWFjYWRlbXkiLCJraWQiOiJlYTE2NzI1ZS1jYTAwLTQxN2QtOTRmZS1hNzBiMTFhMGU0OTMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJjaWQiOiJmYWU4ZmQ2Yi05ODYzLTQxZGMtYmNjNi03ODhiMDEwNmYzYzgiLCJleHAiOjE2MDA3MDQwNjA4ODAsImlhdCI6MTYwMDcwMzE2MDg4MCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3Qvc2hhcmstYWNhZGVteSIsImp0aSI6IjRmZTNmZmExLWQ2Y2YtNGFiYy05N2VjLWY3OTY5OTA0MTBjNyIsImp0dCI6ImFjY2VzcyIsInJlc291cmNlX293bmVyX21ldGFkYXRhIjp7fSwic2NwIjpbImxpbWl0ZWQiXSwic3ViIjoiODM0OGI0MGEtNTYzOS00ZDg4LWIwYTktZGE1N2UzMThjYjg5IiwidG50Ijoic2hhcmstYWNhZGVteSIsInZlciI6MX0.GfO8rOKvQRZDztSG_fa9TRSc_7dCOTHibr1at7_B5CSmkjmBHFH4yKOV0YSO41n9nNZbn5uP9SoTi3jCQnIKBmcilVtQ3hKe9jRtoviCXY0IYbx_9pHBzMagZNoftfXyRBRv247ARHS7e7wQHmfxMpsy7YdUXeAm-YOmiHt0xgG9NmGQq9oH1XpunUwuOvMvBWjw5Hwx-Hx7EK0gmxN2W0Kd_GWVU3CLj-MU1AQ-6FQxV3K4u0dNIv3TqbU-O_Y5g1WN8uCmXdiX_clC4oNYOocs91lgggXQ4CFhCaSZhb92d9Xfz4G12cRkk3wx150TJ6pOHwQizu1IM2E0yY0mzkcTkto7E61QcFsCe3zd2ru8WY21wHIxhXyvxlhYhK4PZRCzZql28S0BcM7F50XSX3ibTfmQWFW3X7pO39M01xQ77NYRX1UNoVcBbGvuHAFCdK7L3IZ9OpmJHM7sbQsSmopLQQKpZRhz9AsweSMf2ae9linqTvqS_juycC9LqqG5tat_fZPMhNLzJkIC-5Ai_4jgd42MpfNo80zTR4pfz5Jw7-LM1uhK7K71Xm-pTaBzSjmBRbY4qPYquDiXcJOGO33NyHX0kfszvVyULPYjEFRLb5A5PQV2PnAIwJjmLFfrxMNj3SN18M2awr0JdlfIBu_c_hiQ7yj9HumUxVJ2ixQ"
const token_2 = "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L3NoYXJrLWFjYWRlbXkiLCJraWQiOiJlYTE2NzI1ZS1jYTAwLTQxN2QtOTRmZS1hNzBiMTFhMGU0OTMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJjaWQiOiJmYWU4ZmQ2Yi05ODYzLTQxZGMtYmNjNi03ODhiMDEwNmYzYzgiLCJleHAiOjE2MDIyNzQwNTQ0ODYsImlhdCI6MTYwMjIzODA1NDQ4NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3Qvc2hhcmstYWNhZGVteSIsImp0aSI6Ijg3Mjk0YTkxLWM0YjUtNDQwYS1iNDEwLWY4OWU3NDc4NTBkYiIsImp0dCI6ImFjY2VzcyIsInJlc291cmNlX293bmVyX21ldGFkYXRhIjp7fSwic2NwIjpbIm9wZW5pZCIsImVtYWlsIl0sInN1YiI6ImRlMWZkNDE3LWMzN2YtNGY2OS04NGIxLTFiMjM0MWQ0MTUyOCIsInRudCI6InNoYXJrLWFjYWRlbXkiLCJ2ZXIiOjF9.n3Q7o8Xe0c3EHbtmJfFGgi3Ji7OwxMNrs_Nv-l-A_kuH90LNxOhBhZDt0EAz7c23Ge-6fK6R-65mLZ6ke_9pTJ094IfXcIjBa1-JADkZt-2xOhp0Z2KeqnZZHH8plpuSciDECw3bu6irHHPNPf2ozqf2Ysni901NHQU4mjG3TTjMjH_GlgG0Yzqg9R2WODdVsaeFWfUKg9A4cVFF3oy8I05I0Zi_bwWRAZ2fwH1oOxoXa6b6bOixXFunCm29E1ADFh9UDz_0aw0zveOGqmmRU30X5wmQzJw0ldakK5sAJ1AEQABFqR9obxeXd7r3558f_ee7kaVO7xDT8_QJ8pbcRgXLXSYyKFewqw9FVAnZoB2naZuovDAUHXeRPedAoV7XpoFcvUEew1tEzKWbTVppk_Bo6sJ7puuosg3T0UNlqBuirgcADxroX9bSGy1socDPZ-rp-rpgGeTRx5YTczPg9YkdY00UouRL0je6JbAPSFIeMtT8vMxxi3ya1asykc7Eq3MfQq0FdoLFNL9Mb_OuJvrJEQRd1xguZWJTeZx75JzdAT1YptMHF_z6yPR8KsQnlqRZBDYu42fV6kf_djP3PqqwcPQwldxVtGJQVWkA27Cs3TDSvhuBJjCQbovGEHG0C_X0DyxISiaKemZ80NM8DVYjko09k8aYqyp9g6Idv-o"
const wrong_token = "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L2xlYW5wYXkiLCJraWQiOiJlOTg2YTA0ZC0xMTk0LTRhNDgtYTAzMi1mMjZiMTlmMGRmOWYiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJodHRwOi8vMTI3LjAuMC4xOjMwMDAiLCJjaWQiOiJlNzJiMWZiZi0zYjY4LTQ4YmUtYmM3Yy1mMDQ3NWMwYTY4YjIiLCJleHAiOjE2MDI0OTU5ODc1MzIsImlhdCI6MTYwMjQ5NTA4NzUzMiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3QvbGVhbnBheSIsImp0aSI6IjkwZDAyY2FmLWVlZTEtNDQxYS1iYjhmLTVjY2VkZDUxMDBlNiIsImp0dCI6ImFjY2VzcyIsInJlc291cmNlX293bmVyX21ldGFkYXRhIjp7ImxlYW5wYXlfdXNlcl9pZCI6IjExM2E3NTczLTAwOWMtNGY0Yi05ZmRkLTQzY2U1NGM4YjQ4YiIsInRlbmFudF9pZCI6ImYwMWQ4M2Q1LTllYzEtNDc4YS1hZjM2LWI5OWQyZDNmMThmYSJ9LCJzY3AiOlsibGltaXRlZCJdLCJzdWIiOiJlNTJhMWI1MS1mMmE4LTQ2MTMtYjZjYy1kYzU1Mjk1YWJlMTQiLCJ0bnQiOiJsZWFucGF5IiwidmVyIjoxfQ.qrgKXlmPZ929fDzxY25nkmzmhhno4Yi8JJrj7cANy6Yb75Fv5H77r88pjz2cfS-7JTHqJ5vjEoAPoo2zKpD--RKWs5FxYVwBHBxq8-Vi1hET5rvH30NN-ZhMwSUrMbAd7E_7whPHM_wH-msldvru5sm_7AkrR-T9yz-RNa0XFY1YQAEjjBNfmdG0lfaF0HHI-P4p41oDgJtpqARQPRgNYtrdFrtNtaMoZQiwX7a7wqX933xxo0FCq_Fgx9FYnxPsLRxOOEPXsuamaavqG2LVaTuZ9ytLoxFEoUlxlBpvBubgL0qjb99mJxwx-94Fe4pzRhBiHSpD5Ivaz8a-V5PAqwyJj82kfbuCxtKRyKES-nVdDxVLLpo0D9YAIm2JZioEVhYuLTi8P2axLDDcrBko4SGgWNDPPtAUKBZzU5r8yXSmvGak-br-SifqFx8UrZ-17cQ3zv2eajn_qWy2UsKXjsXj2dqwXJmNKeaTPwWyxErjJgeHz6ZFMB88FdQnbwSo-HjNwNmdZg4YOGtQJmY_rAJT45bXYDyK_fPSlmy1ugXeS5mOYNO2kPVvtdL8IGM2zbZWYYI02sgi327vo4AnXhj9Byos0tfN4Ag2ZQzW_YhF8SMlpNCEQk2tWQvl5A8z8VKh5IjheTGZwcOxDq2khEmESUehz8Wf6DFcLX9qgtg"

const tokens = [
  token_1,
  token_2,
  wrong_token
]

const accountData = {
  "534dcbe0-c88d-441d-84cd-1daa8dbc8393" : [
    {
      title: "Moby Dick",
      author: "Melville",
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Moby-Dick_FE_title_page.jpg/250px-Moby-Dick_FE_title_page.jpg'
    },
    {
      title: "L'ultime expérience",
      author: "Bruce benamran",
      img: 'https://dl3.pushbulletusercontent.com/ifsR6nuwr4z1YJnUOmvLrQs2jeHF7Jvg/16025214611421816099308499767573.jpg'
    },
    {
      title: "Le papillon des étoiles",
      author: "Bernard Werber",
      img: 'https://images-na.ssl-images-amazon.com/images/I/515GEU7PVOL.jpg'
    }
  ],
  "de1fd417-c37f-4f69-84b1-1b2341d41528": [
    {
      title: "Feed - Tome 2",
      author: "Mira Grant",
      img: 'https://static.fnac-static.com/multimedia/Images/FR/NR/7a/7b/60/6323066/1540-1/tsp20141226102500/Deadline.jpg'
    }
  ]
}

app.use(passport.initialize());
passport.use(new CryptrStrategy(
  // instead of env file we can use {cryptrConfig},
  {
    cleeckConfig: {
      base_url: process.env.CRYPTR_BASE_URL,
      audiences: process.env.CRYPTR_AUDIENCES.split(','),
      issuer: process.env.CRYPTR_ISSUER,
      tenants: process.env.CRYPTR_TENANTS.split(',')
    },
    opts: { test: true }
  },
  function(jwt, done) {
    //Here should be like ResourceOwner.findByClaims(jwt.claims)
    return done(jwt.errors, jwt.claims, null)
  }
));

app.get('/', function(req, res, next) {
  return res.redirect('/login'); 
})

app.get('/my-account', async function(req, res, next) {
  const token = tokens[parseInt(req.query.token) - 1 ]
  let error;
  const data = await axios
    .get(`http://localhost:${port}/books`, {headers: {Authorization: `Bearer ${token}`}})
    .then(res => {
      return res.data
    }).catch((err) => {
      error = err
      return []
    })
  const pageParams = {
    title: 'Secured Page', 
    data: data,
    error: error,
    path: '/'
  }
  res.render('secured-page', pageParams)
})

// app.get('/books', passport.authenticate('cryptr', (a,b, c) => {
//   console.log(typeof a)
//   console.log(typeof b)
//   console.log(typeof c)
// }), (req, res) => {
//   // console.log(res)
//   res.setHeader('Content-Type', 'application/json');
//   res.end("[]");
//   // res.end(JSON.stringify(accountData[claims.sub]));
// })

app.get('/books', function(req, res, next) {
  passport.authenticate('cryptr', function(err, claims, info) {
    if (err || !claims) { 
      const rawBody = err || info;
      if (typeof(rawBody) === "object") {
        return res.status(401).json(rawBody)
      } else {
        return  res.status($401).end(rawBody.toString())
      }
    }
    res.json(accountData[claims.sub] || []);
  })(req, res, next);
})

app.get('/login', (req, res) => {
  res.render('login', {title: 'Login Page', path: '/login'})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

