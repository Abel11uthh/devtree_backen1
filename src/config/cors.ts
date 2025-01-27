import{CorsOptions} from 'cors'


export const corsConfig : CorsOptions = {
  origin: function(origi, callback) {
    console.log(origi)
      const whiteList = [process.env.FRONTEND_URL]

      if(process.argv[2] === '--api') {
          whiteList.push(undefined)
      }

      if(whiteList.includes(origi)) {
          callback(null, true)
      } else {
          callback(new Error('Error de CORS'))
      }
  }
}