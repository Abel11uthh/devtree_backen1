import colors from 'colors';
import server from './server'


const port=process.env.PORT || 8000;
server.listen(port, () => {
    console.log(colors.blue.bold(`el servidor esta funcionando en el puerto:${port}`))
})

