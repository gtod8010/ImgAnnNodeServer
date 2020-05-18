const util = require('util');

module.exports = (dataModel) => {
    return {
        getSingleShape : _getSingleShapeFunc(dataModel),
        postSingleShape : _postSingleShapeFunc(dataModel),
        putSingleShape : _putSingleShapeFunc(dataModel),
        patchSingleShape : _patchSingleShapeFunc(dataModel),
        deleteSingleShape : _deleteSingleShapeFunc(dataModel),

        getMultiShape : _getMultipleShapeFunc(dataModel),
        postMultiShape : _postMultipleShapeFunc(dataModel),
        putMultiShape : _putMultipleShapeFunc(dataModel),
        patchMultiShape : _patchMultipleShapeFunc(dataModel),
        deleteMultiShape : _deleteMultipleShapeFunc(dataModel)
    }
}

const checkInputFormat = {
    singleShape : checkInputSingleShape,
    singlePutShape : checkPutSingleShape,
}

const SHAPE_TYPE = {
    POINT : 'point',
    BBOX : 'bbox',
    POLYLINE : 'polyline',
    POLYGON : 'polygon'
}


//TODO : 내부구현 해야 함
//GET /api/v1/annotation/one/:image/:shape
function _getSingleShapeFunc(dataModel) {
    //getSingleShape
    return async(req,res,next) => {
        
        //TODO : 내부구현 해야 함
        const annotation = await dataModel.getAnnotation(imageId,annotationId);
    }
}

// POST /api/v1/annotation/one/:image
function _postSingleShapeFunc(dataModel) {
    //postSingleShape
    return async(req,res,next) => {
        const inputData = req.body
	console.log(inputData);
        const checkErr = await checkInputFormat.singleShape(inputData);
        if(checkErr) {
            const message = {
                'status' : 'bad request',
                'detail' : checkErr
            }
            console.log(checkErr);
            res.status(400).json(message);
        }
        
        const imageId = req.params.image;
        
        try{
            const annotationId = await dataModel.addAnnotation(imageId,inputData);
            const message = {
                'status' : 'success',
                'image_id' : imageId,
                'shape_id' : annotationId
            };
            res.status(200).json(message);
            return;
        } catch (err) {
            console.log(err);
            const message = {
                'status' : 'Internal Server Error',
                'detail' : 'sorry, you connot registrate annotation...maybe...the data server have went to USA...\n'+
                            '///////////////////////////////////////////////////////////////////////////////(/(//(/((///(((((((((((\n'+
                            '////////////////////////////////////(((///(((((####%%#####(//////////////////////(,,*,(///((((((((((((\n'+
                            '///(((//////////////////////////////((/(%######################%#////////((((((/#,,,,#//((((((((((((((\n'+
                            '//(((((((((((((((((((((((((((/(((((#%##############################%((((((((((((**,,*(((((((((((((((((\n'+
                            '//((((((((((((((((((((((((((((((#######################################((((((((#,*****,,(//(((((((((((\n'+
                            '//////////////////////////////%##########################################((((((%(**((*,,/,,*(#((((((((\n'+
                            '////////////////////////////##############################################/////,,,,,,,,(,,,(,,((((((((\n'+
                            '//***********************/*%###############################################(///,,,,,(*,,(,,,,#((((((((\n'+
                            '//************************%#################################################(//*,,,,**,,,,,((((((((((/\n'+
                            '//,,,,,,,,,,,,,,,,,,,,,,,%###################################################((#*,,,,,,,,,//(/////(///\n'+
                            '//*******,,*,*,,,,,,,,,,,#####################################%%%#(//*********(((#,,,,,,#(#/(/////////\n'+
                            '//%%%%%%%%%%%%%%%%%%&%%%&########################%#/*,********,,****,,********/((((((((##%%%//(///////\n'+
                            '//######################%##############%%(***,,,,*,,,***,,,****(*,,***,*****,,*(((((((((((#/(/////////\n'+
                            '//*************,********%#######%/***,******,**,** ,**,**,,#**,,*,,******,*,,,*((((((((((%//(/////////\n'+
                            '//*,,**,,,,,,,,,,,,,,,,,%%/****,*,*,(***,,*,,,*,****,*,***,,,*,**///*,,*/,*,*,*/****#((##*//(/////////\n'+
                            '//*,,,*******,,,,,,,,,,,(*,**,***,,,,,,,**,,,,,,*,,********,(            *,.*,*(#*,*#((%////(/////////\n'+
                            '//*,,,,,,,,,,,,,,,,,,,,,,*,**,***,,,*,,***///*,,*/(,**,**,/    *@,     ***,*,,*%,#,*#(%*////(/////////\n'+
                            '//*,,*********,*****,,,*,(********,**,           . (**,******(.     /******,,**/**(((#**////(/////////\n'+
                            '//****************,,,,/******,,.*,,,,(           .*,********,,,,**,,*********,((((((/***////(/////////\n'+
                            '//***************,**,(,*/(/,*,****,,,,***//////***,,*****,***,,****,,,,******#((((#*****//////////////\n'+
                            '//((((((((((((((((((((,**,(,*,*,*,,,*,*********,*,***,,**,*/*.   #/,,,*,,,**#((((#******//////////////\n'+
                            '//,,,,*((((((((((((((((*****,*,/,**,,,********/#         .,(%%%%%%%**,,,**%(((((#********/////////////\n'+
                            '//,,,,*((((((((((//////(/##//##(#/*,,,,******(%%%%%%%(****/##/*,**,,***/#(((((#/*********/////////////\n'+
                            '//,,,,*(((((##,,,,,,,,,,*(#((#(#%,,*(*,**,,,,**//***,,*,*,**,******/#((((((((%**********//////////////\n'+
                            '//,,,,*(#(##(#,,,,,,,,,,*###(###%(((((((%/*,*,,***,,,****,**,*#,.  #((((((((/***********//////////////\n'+
                            '//,,,**(######,,,,,,,,,,/#%#(((((((((((((((.          ,(#(,       ,(((((%(#,************//////////////\n'+
                            '//,**,*#######,,,,,,,,*((((((((((((((((((((#..    #((((  .(((((  #((((((%,,**************/////////////\n'+
                            '//##############%%###%((((((((((((((((((((((((((((((((((/(((((((/(((((((*,,,,************/////////////\n'+
                            '//##################%(((((((((((((((((((%#((((((((((((((((((#*****,*,,,,,(,,,************/////////////\n'+
                            '//*******,**********%((((((((((((((#*(((((((((((((#####(((((#,**..**./*.*#*,,************//(//////////'
            };
            res.status(500).json(message);
            next(err);
            return;
        }
        
    }
}

//PUT /api/v1/annotation/one
function _putSingleShapeFunc(dataModel) {
    //putSingleShape
    return async(req,res,next) => {


        const imageId = req.params.image;
        const inputData = req.body
        const checkErr = await checkInputFormat.singlePutShape(inputData);
        if(checkErr) {
            const message = {
                'status' : 'bad request',
                'detail' : checkErr
            }
            console.log(checkErr);
            res.status(400).json(message);
        }

        try {
            const putRes = await dataModel.putAnnotation(imageId,inputData);
            message = {
                'status' : 'success',
                'shape_id' : putRes['shape_id'],
                'version' : putRes['version']
            }
            res.status(200).json(message);
            return;
        } catch (err) {
            console.log(err);
            const message = {
                'status' : 'Internal Server Error',
                'detail' : 'sorry, you connot registrate annotation...maybe...the data server have went to USA...\n'+
                            '///////////////////////////////////////////////////////////////////////////////(/(//(/((///(((((((((((\n'+
                            '////////////////////////////////////(((///(((((####%%#####(//////////////////////(,,*,(///((((((((((((\n'+
                            '///(((//////////////////////////////((/(%######################%#////////((((((/#,,,,#//((((((((((((((\n'+
                            '//(((((((((((((((((((((((((((/(((((#%##############################%((((((((((((**,,*(((((((((((((((((\n'+
                            '//((((((((((((((((((((((((((((((#######################################((((((((#,*****,,(//(((((((((((\n'+
                            '//////////////////////////////%##########################################((((((%(**((*,,/,,*(#((((((((\n'+
                            '////////////////////////////##############################################/////,,,,,,,,(,,,(,,((((((((\n'+
                            '//***********************/*%###############################################(///,,,,,(*,,(,,,,#((((((((\n'+
                            '//************************%#################################################(//*,,,,**,,,,,((((((((((/\n'+
                            '//,,,,,,,,,,,,,,,,,,,,,,,%###################################################((#*,,,,,,,,,//(/////(///\n'+
                            '//*******,,*,*,,,,,,,,,,,#####################################%%%#(//*********(((#,,,,,,#(#/(/////////\n'+
                            '//%%%%%%%%%%%%%%%%%%&%%%&########################%#/*,********,,****,,********/((((((((##%%%//(///////\n'+
                            '//######################%##############%%(***,,,,*,,,***,,,****(*,,***,*****,,*(((((((((((#/(/////////\n'+
                            '//*************,********%#######%/***,******,**,** ,**,**,,#**,,*,,******,*,,,*((((((((((%//(/////////\n'+
                            '//*,,**,,,,,,,,,,,,,,,,,%%/****,*,*,(***,,*,,,*,****,*,***,,,*,**///*,,*/,*,*,*/****#((##*//(/////////\n'+
                            '//*,,,*******,,,,,,,,,,,(*,**,***,,,,,,,**,,,,,,*,,********,(            *,.*,*(#*,*#((%////(/////////\n'+
                            '//*,,,,,,,,,,,,,,,,,,,,,,*,**,***,,,*,,***///*,,*/(,**,**,/    *@,     ***,*,,*%,#,*#(%*////(/////////\n'+
                            '//*,,*********,*****,,,*,(********,**,           . (**,******(.     /******,,**/**(((#**////(/////////\n'+
                            '//****************,,,,/******,,.*,,,,(           .*,********,,,,**,,*********,((((((/***////(/////////\n'+
                            '//***************,**,(,*/(/,*,****,,,,***//////***,,*****,***,,****,,,,******#((((#*****//////////////\n'+
                            '//((((((((((((((((((((,**,(,*,*,*,,,*,*********,*,***,,**,*/*.   #/,,,*,,,**#((((#******//////////////\n'+
                            '//,,,,*((((((((((((((((*****,*,/,**,,,********/#         .,(%%%%%%%**,,,**%(((((#********/////////////\n'+
                            '//,,,,*((((((((((//////(/##//##(#/*,,,,******(%%%%%%%(****/##/*,**,,***/#(((((#/*********/////////////\n'+
                            '//,,,,*(((((##,,,,,,,,,,*(#((#(#%,,*(*,**,,,,**//***,,*,*,**,******/#((((((((%**********//////////////\n'+
                            '//,,,,*(#(##(#,,,,,,,,,,*###(###%(((((((%/*,*,,***,,,****,**,*#,.  #((((((((/***********//////////////\n'+
                            '//,,,**(######,,,,,,,,,,/#%#(((((((((((((((.          ,(#(,       ,(((((%(#,************//////////////\n'+
                            '//,**,*#######,,,,,,,,*((((((((((((((((((((#..    #((((  .(((((  #((((((%,,**************/////////////\n'+
                            '//##############%%###%((((((((((((((((((((((((((((((((((/(((((((/(((((((*,,,,************/////////////\n'+
                            '//##################%(((((((((((((((((((%#((((((((((((((((((#*****,*,,,,,(,,,************/////////////\n'+
                            '//*******,**********%((((((((((((((#*(((((((((((((#####(((((#,**..**./*.*#*,,************//(//////////'
            };
            res.status(500).json(message);
            next(err);
            return;
        }
        
    }
}

//TODO : 내부구현 해야 함
//PATCH /api/v1/annotation/one
function _patchSingleShapeFunc(dataModel) {
    //patchSingleShape
    return async(req,res,next) => {

        //TODO : 내부구현 해야 함
        const patchRes = await dataModel.patchAnnotation(patchData);
    }
}

//TODO : 내부구현 해야 함
//DELETE /api/v1/annotation/one/:image/:shape
function _deleteSingleShapeFunc(dataModel) {
    //deleteSingleShape
    return async(req,res,next) => {
	
	console.log("delete call");

        const imageId = req.params.image;
        const annotationId = req.params.shape;

        console.log(imageId);
	console.log(annotationId);

        let completely = false;
        let deleteStatus = 'recoverable'
        if (req.query.completely === 'true') {
            completely = true;
            deleteStatus = 'completely'
        }
        
        
        try {
            await dataModel.deleteAnnotation(imageId,annotationId,completely);
            const message = {
                'status' : 'success',
                'image_id' : imageId,
                'shape_id' : annotationId,
                'delete_status' : deleteStatus
            };
            res.status(200).json(message);
        } catch (err){
            console.log(err);
            const message = {
                'status' : 'Internal Server Error',
                'detail' : 'sorry, you connot registrate annotation...maybe...the data server have went to USA...\n'+
                            '///////////////////////////////////////////////////////////////////////////////(/(//(/((///(((((((((((\n'+
                            '////////////////////////////////////(((///(((((####%%#####(//////////////////////(,,*,(///((((((((((((\n'+
                            '///(((//////////////////////////////((/(%######################%#////////((((((/#,,,,#//((((((((((((((\n'+
                            '//(((((((((((((((((((((((((((/(((((#%##############################%((((((((((((**,,*(((((((((((((((((\n'+
                            '//((((((((((((((((((((((((((((((#######################################((((((((#,*****,,(//(((((((((((\n'+
                            '//////////////////////////////%##########################################((((((%(**((*,,/,,*(#((((((((\n'+
                            '////////////////////////////##############################################/////,,,,,,,,(,,,(,,((((((((\n'+
                            '//***********************/*%###############################################(///,,,,,(*,,(,,,,#((((((((\n'+
                            '//************************%#################################################(//*,,,,**,,,,,((((((((((/\n'+
                            '//,,,,,,,,,,,,,,,,,,,,,,,%###################################################((#*,,,,,,,,,//(/////(///\n'+
                            '//*******,,*,*,,,,,,,,,,,#####################################%%%#(//*********(((#,,,,,,#(#/(/////////\n'+
                            '//%%%%%%%%%%%%%%%%%%&%%%&########################%#/*,********,,****,,********/((((((((##%%%//(///////\n'+
                            '//######################%##############%%(***,,,,*,,,***,,,****(*,,***,*****,,*(((((((((((#/(/////////\n'+
                            '//*************,********%#######%/***,******,**,** ,**,**,,#**,,*,,******,*,,,*((((((((((%//(/////////\n'+
                            '//*,,**,,,,,,,,,,,,,,,,,%%/****,*,*,(***,,*,,,*,****,*,***,,,*,**///*,,*/,*,*,*/****#((##*//(/////////\n'+
                            '//*,,,*******,,,,,,,,,,,(*,**,***,,,,,,,**,,,,,,*,,********,(            *,.*,*(#*,*#((%////(/////////\n'+
                            '//*,,,,,,,,,,,,,,,,,,,,,,*,**,***,,,*,,***///*,,*/(,**,**,/    *@,     ***,*,,*%,#,*#(%*////(/////////\n'+
                            '//*,,*********,*****,,,*,(********,**,           . (**,******(.     /******,,**/**(((#**////(/////////\n'+
                            '//****************,,,,/******,,.*,,,,(           .*,********,,,,**,,*********,((((((/***////(/////////\n'+
                            '//***************,**,(,*/(/,*,****,,,,***//////***,,*****,***,,****,,,,******#((((#*****//////////////\n'+
                            '//((((((((((((((((((((,**,(,*,*,*,,,*,*********,*,***,,**,*/*.   #/,,,*,,,**#((((#******//////////////\n'+
                            '//,,,,*((((((((((((((((*****,*,/,**,,,********/#         .,(%%%%%%%**,,,**%(((((#********/////////////\n'+
                            '//,,,,*((((((((((//////(/##//##(#/*,,,,******(%%%%%%%(****/##/*,**,,***/#(((((#/*********/////////////\n'+
                            '//,,,,*(((((##,,,,,,,,,,*(#((#(#%,,*(*,**,,,,**//***,,*,*,**,******/#((((((((%**********//////////////\n'+
                            '//,,,,*(#(##(#,,,,,,,,,,*###(###%(((((((%/*,*,,***,,,****,**,*#,.  #((((((((/***********//////////////\n'+
                            '//,,,**(######,,,,,,,,,,/#%#(((((((((((((((.          ,(#(,       ,(((((%(#,************//////////////\n'+
                            '//,**,*#######,,,,,,,,*((((((((((((((((((((#..    #((((  .(((((  #((((((%,,**************/////////////\n'+
                            '//##############%%###%((((((((((((((((((((((((((((((((((/(((((((/(((((((*,,,,************/////////////\n'+
                            '//##################%(((((((((((((((((((%#((((((((((((((((((#*****,*,,,,,(,,,************/////////////\n'+
                            '//*******,**********%((((((((((((((#*(((((((((((((#####(((((#,**..**./*.*#*,,************//(//////////'
            };
            res.status(500).json(message);
            next(err);
            return;
        }
        
    }
}







//GET /api/v1/annotation/multiple
function _getMultipleShapeFunc(dataModel) {
    //getMultipleShape
    return async(req,res,next) => {
        const imageId = req.params.image;
        let annotationIds = ["all"]
        try {
            annotationIds = JSON.parse(req.query.annotations);
        } catch (err) {
            const message = {
                'status' : 'bad request',
                'detail' : util.format('Annotation query string must be list format, but your annotation is : %s',annotationIds)
            }
            console.log(err);
            res.status(400).json(message);
        }
        try {
            const annotationData = await dataModel.getAnnotation(imageId,annotationIds);
            ResponseBody = {
                'status' : 'sucess',
                'image_id' : annotationData.image_id,
                'annotations' : annotationData.annotations
            }
            res.status(200).json(ResponseBody)
        } catch(err) {
            console.log(err);
            const message = {
                'status' : 'Internal Server Error',
                'detail' : 'sorry, you connot registrate annotation...maybe...the data server have went to USA...\n'+
                            '///////////////////////////////////////////////////////////////////////////////(/(//(/((///(((((((((((\n'+
                            '////////////////////////////////////(((///(((((####%%#####(//////////////////////(,,*,(///((((((((((((\n'+
                            '///(((//////////////////////////////((/(%######################%#////////((((((/#,,,,#//((((((((((((((\n'+
                            '//(((((((((((((((((((((((((((/(((((#%##############################%((((((((((((**,,*(((((((((((((((((\n'+
                            '//((((((((((((((((((((((((((((((#######################################((((((((#,*****,,(//(((((((((((\n'+
                            '//////////////////////////////%##########################################((((((%(**((*,,/,,*(#((((((((\n'+
                            '////////////////////////////##############################################/////,,,,,,,,(,,,(,,((((((((\n'+
                            '//***********************/*%###############################################(///,,,,,(*,,(,,,,#((((((((\n'+
                            '//************************%#################################################(//*,,,,**,,,,,((((((((((/\n'+
                            '//,,,,,,,,,,,,,,,,,,,,,,,%###################################################((#*,,,,,,,,,//(/////(///\n'+
                            '//*******,,*,*,,,,,,,,,,,#####################################%%%#(//*********(((#,,,,,,#(#/(/////////\n'+
                            '//%%%%%%%%%%%%%%%%%%&%%%&########################%#/*,********,,****,,********/((((((((##%%%//(///////\n'+
                            '//######################%##############%%(***,,,,*,,,***,,,****(*,,***,*****,,*(((((((((((#/(/////////\n'+
                            '//*************,********%#######%/***,******,**,** ,**,**,,#**,,*,,******,*,,,*((((((((((%//(/////////\n'+
                            '//*,,**,,,,,,,,,,,,,,,,,%%/****,*,*,(***,,*,,,*,****,*,***,,,*,**///*,,*/,*,*,*/****#((##*//(/////////\n'+
                            '//*,,,*******,,,,,,,,,,,(*,**,***,,,,,,,**,,,,,,*,,********,(            *,.*,*(#*,*#((%////(/////////\n'+
                            '//*,,,,,,,,,,,,,,,,,,,,,,*,**,***,,,*,,***///*,,*/(,**,**,/    *@,     ***,*,,*%,#,*#(%*////(/////////\n'+
                            '//*,,*********,*****,,,*,(********,**,           . (**,******(.     /******,,**/**(((#**////(/////////\n'+
                            '//****************,,,,/******,,.*,,,,(           .*,********,,,,**,,*********,((((((/***////(/////////\n'+
                            '//***************,**,(,*/(/,*,****,,,,***//////***,,*****,***,,****,,,,******#((((#*****//////////////\n'+
                            '//((((((((((((((((((((,**,(,*,*,*,,,*,*********,*,***,,**,*/*.   #/,,,*,,,**#((((#******//////////////\n'+
                            '//,,,,*((((((((((((((((*****,*,/,**,,,********/#         .,(%%%%%%%**,,,**%(((((#********/////////////\n'+
                            '//,,,,*((((((((((//////(/##//##(#/*,,,,******(%%%%%%%(****/##/*,**,,***/#(((((#/*********/////////////\n'+
                            '//,,,,*(((((##,,,,,,,,,,*(#((#(#%,,*(*,**,,,,**//***,,*,*,**,******/#((((((((%**********//////////////\n'+
                            '//,,,,*(#(##(#,,,,,,,,,,*###(###%(((((((%/*,*,,***,,,****,**,*#,.  #((((((((/***********//////////////\n'+
                            '//,,,**(######,,,,,,,,,,/#%#(((((((((((((((.          ,(#(,       ,(((((%(#,************//////////////\n'+
                            '//,**,*#######,,,,,,,,*((((((((((((((((((((#..    #((((  .(((((  #((((((%,,**************/////////////\n'+
                            '//##############%%###%((((((((((((((((((((((((((((((((((/(((((((/(((((((*,,,,************/////////////\n'+
                            '//##################%(((((((((((((((((((%#((((((((((((((((((#*****,*,,,,,(,,,************/////////////\n'+
                            '//*******,**********%((((((((((((((#*(((((((((((((#####(((((#,**..**./*.*#*,,************//(//////////'
            };
            res.status(500).json(message);
            next(err);
            return;
        }
    }
}

// TODO : 내부구현 해야 함
// POST /api/v1/annotation/multiple
function _postMultipleShapeFunc(dataModel) {
    //postMultipleShape
    return async(req,res,next) => {

        //TODO : 내부구현 해야 함
        const postRes = await dataModel.addAnnotation(inputData);
    }
}



//TODO : 내부구현 해야 함
//UPDATE /api/v1/annotation/multiple
function _updateMultipleShapeFunc(dataModel) {
    //updateMultipleShape
    return async(req,res,next) => {

        //TODO : 내부구현 해야 함
        const updateRes = await dataModel.updateAnnotation(updateData);
    }
}

//TODO : 내부구현 해야 함
//PUT /api/v1/annotation/multiple
function _putMultipleShapeFunc(dataModel) {
    //putMultipleShape
    return async(req,res,next) => {

        //TODO : 내부구현 해야 함
        const putRes = await dataModel.putAnnotation(inputData);
    }
}

//TODO : 내부구현 해야 함
//PATCH /api/v1/annotation/multiple
function _patchMultipleShapeFunc(dataModel) {
    //patchMultipleShape
    return async(req,res,next) => {

        //TODO : 내부구현 해야 함
        const patchRes = await dataModel.patchAnnotation(patchData);
    }
}

//TODO : 내부구현 해야 함
//DELETE /api/v1/annotation/multiple
function _deleteMultipleShapeFunc(dataModel) {
    //deleteMultipleShape
    return async(req,res,next) => {

        //TODO : 내부구현 해야 함
        const deleteRes = await dataModel.deleteAnnotation(imageId,annotationId);
    }
}

async function checkInputSingleShape(inputData) {
    
    //check shape_type field : field, value, type_valid
    if(!('shape_type' in inputData)) {
        return 'not found shape_type field, you have to input shape_type field';
    }

    if(!inputData['shape_type']) {
        return 'not found shape_type value, you have to input shape_type value';
    }
    if( Object.values(SHAPE_TYPE).indexOf(inputData['shape_type']) === -1) {
        return util.format('shape_type must be point,bbox,polyline or polygon, but your shape_type is : %s',inputData['shape_type'])
    }

    //check class field : field, value, number
    if(!('class' in inputData)) {
        return 'not found class field, you have to input class field';
    }

    if(inputData['class'] === null) {
        return 'not found class value, you have to input class value';
    }

    if(isNaN(inputData['class'])) {
        return util.format('class must be a number, but your class is : %s',inputData['class']);
    }

    //check recognition field : field, value, number
    if(!('recognition' in inputData)) {
        return 'not found recognition field, you have to input recognition field';
    }

    if(inputData['recognition']  === null) {
        return 'not found recognition value, you have to input recognition value';
    }

    if(isNaN(inputData['recognition'])) {
        return util.format('recognition must be a number, but your recognition is : %s',inputData['recognition']);
    }

    const shapeType = inputData['shape_type']
    const shape = inputData[shapeType]

    //check shape field dpend on shape type value :field, value, format
    if(!(shapeType in inputData)) {
        return util.format('not found %s field, you have to shape field that is same shape_type : %s',shapeType,shapeType)
    }

    if(!shape) {
        return util.format('not found %s value, you have to input %s value',shapeType,shapeType)
    }

    switch(shapeType) {
    case SHAPE_TYPE.POINT:
        if(!(('x' in shape) && ('y' in shape))) {
            return 'x,y have to be contained in point'
        }
        if(isNaN(shape['x']) || isNaN(shape['y'])) {
            return 'x and y must be a number'
        }
        break;
    case SHAPE_TYPE.BBOX:
        if(getType(shape) !== 'Array'){
            return util.format('bbox object nust be array type : %s',getType(shape))
        }
        if(shape.length != 3){
            return util.format('bbox object length nust be 3 : %s',shape.lengthe)
        }
        if(!(('x' in shape[0]) && ('y' in shape[0]) && ('x' in shape[1]) && ('y' in shape[1]))) {
            return 'x,y have to be contained in point'
        } 
        if(isNaN(shape[0]['x']) || isNaN(shape[0]['y']) || isNaN(shape[1]['x']) || isNaN(shape[1]['y'])) {
            return 'x and y must be a number'
        }
        if(!(('width' in shape[2]) && ('height' in shape[2]))) {
            return 'width,height have to be contained in bbox'
        }
        if(isNaN(shape[2]['width']) || isNaN(shape[2]['height'])) {
            return 'width and height must be a number'
        }
        break;
    case SHAPE_TYPE.POLYLINE:
        if(getType(shape) !== 'Array'){
            return util.format('bbox object nust be array type : %s',getType(shape))
        }
        if(shape.length < 2){
            return util.format('polyline object length nust be small then 2: %s',shape.length)
        }
        for (var point of shape) {
            if(!(('x' in point) && ('y' in point))) {
                return 'x,y have to be contained in point of polyline'
            }
            if(isNaN(point['x']) || isNaN(point['y'])) {
                return 'x and y in point of polyline must be a number'
            }
        }
        break;
    case SHAPE_TYPE.POLYGON:
        if(getType(shape) !== 'Array'){
            return util.format('bbox object nust be array type : %s',getType(shape))
        }
        if(shape.length < 3){
            return util.format('polyline object length nust be small then 3: %s',shape.length)
        }
        for (var point of shape) {
            if(!(('x' in point) && ('y' in point))) {
                return 'x,y have to be contained in point of polyline'
            }
            if(isNaN(point['x']) || isNaN(point['y'])) {
                return 'x and y in point of polyline must be a number'
            }
        }
        break;
    }

    return null;
}

async function checkPutSingleShape(putData) {
    if(!('shape_id' in putData)) {
        return 'not found shape_id field, you have to input shape_id field';
    }
    if(isNaN(putData['shape_id'])) {
        return util.format('shape id must be a number,but your shape id : %s',putData['shape_id']);
    }

    return await checkInputSingleShape(putData);
}

function getType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
}
