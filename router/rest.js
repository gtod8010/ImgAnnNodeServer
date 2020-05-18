const fs = require("fs")
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const dataModel = require('../model/data')(config['db_info']);
const image = require('./image')(config,dataModel);
const shape = require('./shape')(dataModel);
const task = require('./task')(dataModel);

module.exports = function(app)
{
    app.get('/api/v1/image/urls/:num',image.getImageUrl);
    app.get('/download/:image',image.downloadImage);
    
    //TODO : 내부구현 해야 함
    app.get('/api/v1/annotation/one/:image/:shape',shape.getSingleShape);
    app.post('/api/v1/annotation/one/:image',shape.postSingleShape);
    //app.update('/api/v1/annotation/one',shape.updateSingleShape);
    app.put('/api/v1/annotation/one/:image',shape.putSingleShape);
    app.patch('/api/v1/annotation/one',shape.patchSingleShape);
    app.delete('/api/v1/annotation/one/:image/:shape',shape.deleteSingleShape);

    //TODO : 내부구현 해야 함
    app.get('/api/v1/annotation/multiple/:image',shape.getMultiShape);
    app.post('/api/v1/annotation/multiple',shape.postMultiShape);
    //app.update('/api/v1/annotation/multiple',shape.updateMultiShape);
    app.put('/api/v1/annotation/multiple',shape.putMultiShape);
    app.patch('/api/v1/annotation/multiple',shape.patchMultiShape);
    app.delete('/api/v1/annotation/multiple',shape.deleteMultiShape);

    //TODO : 내부구현 해야 함
    app.put('/api/v1/image/workplace/:image',task.loadWorkplace);
    app.put('/api/v1/image/commit/:image',task.commit);
}