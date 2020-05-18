const util = require('util');
const path = require('path');
const fs = require('fs')


module.exports = (config,dataModel) => {
    return {
        getImageUrl :  _getImageUrlFunc(dataModel,config['server_host']),
        downloadImage : _downloadImageFunc(dataModel,config['data_root'])
    };
}


// GET /api/v1/image/urls/:num
function _getImageUrlFunc(dataModel,host){
    //getImageUrl
    return async(req,res,next) => {
        const imageAmount = req.params.num;

        if (isNaN(imageAmount)){
            const errMsg = util.format('you have to input only number param. But your param is %s',imageAmount);
            const message = {
                'status' : 'bad request',
                'detail' : errMsg
            };
            console.log(errMsg);
            res.status(400).json(message);
            return;
        }

        try{
            dbRes = await dataModel.loadImageUrl(imageAmount,0,host)
            const message = {
                'status' : 'success',
                'images' : dbRes
            };
            res.status(200).json(message);
            return;
        } catch (err) {
            console.log(err);

            const message = {
                'status' : 'Internal Server Error',
                'detail' : 'sorry, you connot take image url that you want to...maybe...the data server have went to USA...'
            };
            
                ///////////////////////////////////////////////////////////////////////////////(/(//(/((///(((((((((((
                ////////////////////////////////////(((///(((((####%%#####(//////////////////////(,,*,(///((((((((((((
                ///(((//////////////////////////////((/(%######################%#////////((((((/#,,,,#//((((((((((((((
                //(((((((((((((((((((((((((((/(((((#%##############################%((((((((((((**,,*(((((((((((((((((
                //((((((((((((((((((((((((((((((#######################################((((((((#,*****,,(//(((((((((((
                //////////////////////////////%##########################################((((((%(**((*,,/,,*(#((((((((
                ////////////////////////////##############################################/////,,,,,,,,(,,,(,,((((((((
                //***********************/*%###############################################(///,,,,,(*,,(,,,,#((((((((
                //************************%#################################################(//*,,,,**,,,,,((((((((((/
                //,,,,,,,,,,,,,,,,,,,,,,,%###################################################((#*,,,,,,,,,//(/////(///
                //*******,,*,*,,,,,,,,,,,#####################################%%%#(//*********(((#,,,,,,#(#/(/////////
                //%%%%%%%%%%%%%%%%%%&%%%&########################%#/*,********,,****,,********/((((((((##%%%//(///////
                //######################%##############%%(***,,,,*,,,***,,,****(*,,***,*****,,*(((((((((((#/(/////////
                //*************,********%#######%/***,******,**,** ,**,**,,#**,,*,,******,*,,,*((((((((((%//(/////////
                //*,,**,,,,,,,,,,,,,,,,,%%/****,*,*,(***,,*,,,*,****,*,***,,,*,**///*,,*/,*,*,*/****#((##*//(/////////
                //*,,,*******,,,,,,,,,,,(*,**,***,,,,,,,**,,,,,,*,,********,(            *,.*,*(#*,*#((%////(/////////
                //*,,,,,,,,,,,,,,,,,,,,,,*,**,***,,,*,,***///*,,*/(,**,**,/    *@,     ***,*,,*%,#,*#(%*////(/////////
                //*,,*********,*****,,,*,(********,**,           . (**,******(.     /******,,**/**(((#**////(/////////
                //****************,,,,/******,,.*,,,,(           .*,********,,,,**,,*********,((((((/***////(/////////
                //***************,**,(,*/(/,*,****,,,,***//////***,,*****,***,,****,,,,******#((((#*****//////////////
                //((((((((((((((((((((,**,(,*,*,*,,,*,*********,*,***,,**,*/*.   #/,,,*,,,**#((((#******//////////////
                //,,,,*((((((((((((((((*****,*,/,**,,,********/#         .,(%%%%%%%**,,,**%(((((#********/////////////
                //,,,,*((((((((((//////(/##//##(#/*,,,,******(%%%%%%%(****/##/*,**,,***/#(((((#/*********/////////////
                //,,,,*(((((##,,,,,,,,,,*(#((#(#%,,*(*,**,,,,**//***,,*,*,**,******/#((((((((%**********//////////////
                //,,,,*(#(##(#,,,,,,,,,,*###(###%(((((((%/*,*,,***,,,****,**,*#,.  #((((((((/***********//////////////
                //,,,**(######,,,,,,,,,,/#%#(((((((((((((((.          ,(#(,       ,(((((%(#,************//////////////
                //,**,*#######,,,,,,,,*((((((((((((((((((((#..    #((((  .(((((  #((((((%,,**************/////////////
                //##############%%###%((((((((((((((((((((((((((((((((((/(((((((/(((((((*,,,,************/////////////
                //##################%(((((((((((((((((((%#((((((((((((((((((#*****,*,,,,,(,,,************/////////////
                //*******,**********%((((((((((((((#*(((((((((((((#####(((((#,**..**./*.*#*,,************//(//////////
    
            res.status(500).json(message);
            next(err);
            return;
        }
    };
}

// GET /download/:pvrid
function _downloadImageFunc(dataModel,dataRoot){
    // downloadImage
    return async(req,res,next) => {

        console.log("download");
        const imageId = req.params.image
        let sourcePath;

        if (isNaN(imageId)){
            const errMsg = util.format('you have to input only image id  format number. But your param is %s',imageId);
            const message = {
                'status' : 'bad request',
                'detail' : errMsg
            };
            console.log(errMsg);
            res.status(400).json(message);
            return;
        }
        try{
            sourcePath = await dataModel.id2path(imageId);
        } catch (err) {
            console.log(err);

            const message = {
                'status' : 'Internal Server Error',
                'detail' : 'sorry, you connot download image. Check your URL'
            };
            res.status(500).json(message);
            next(err);
            return;
        }

        const filePath = path.join(dataRoot,sourcePath)
        if (!fs.existsSync(filePath)) {
            const message = {
                'status' : 'Internal Server Error',
                'detail' : util.format('sorry, you connot download image. it is not exist image file : %s',filePath)
            }
            res.status(500).json(message);
            return;
        }
        
        res.status(200).download(filePath);
        return;
        
    };
}
