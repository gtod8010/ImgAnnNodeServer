const util = require('util');
const path = require('path');


module.exports = function(dbInfo){
    const pool = require('./pool')(dbInfo);
    return {
        loadImageUrl : _loadImageUrlFunc(pool),
        id2path : _id2pathFunc(pool),
        getAnnotation : _getAnnotationFunc(pool),
        addAnnotation : _addAnnotationFunc(pool),
        putAnnotation : _putAnnotationFunc(pool),
        patchAnnotation : _patchAnnotationFunc(pool),
        deleteAnnotation : _deleteAnnotationFunc(pool),
        assignTaskIntoWorkplace : _assignTaskIntoWorkplace(pool),
        commitTask : _commitTask(pool)
    } 
}

const SHAPE_TYPE = {
    POINT : 'point',
    BBOX : 'bbox',
    POLYLINE : 'polyline',
    POLYGON : 'polygon'
}

function _loadImageUrlFunc(pool){
    return async(imageAmount,worker,host) => {
        
        const rows = await pool.query('CALL load_image(?,?)',[imageAmount,Math.round(Date.now()%10000000)]);

        console.log(rows);

        const images = [];

        for (const [_,row] of Object.entries(rows[0][0])) {
            images.push({
                'id' : row.id,
                'width' : row.width, 
                'height' : row.height,
                'img_url' : host+'/download/'+row.id.toString()
            });
        }

        return images;
    };
}

function _id2pathFunc(pool){
    return async(id) => {
        const dbRes = await pool.query('SELECT * FROM image WHERE id=?',id);
        console.log(dbRes[0][0])
        return dbRes[0][0].sourcepath;
    };
}

//TODO
function _getAnnotationFunc(pool) {
    return async(imageId,annotationId) => {
        if (Array.isArray(annotationId)) {
            return await _getMultiAnnotation(pool,imageId,annotationId)
        }
    }
}

async function _getSingleAnnotation(pool,imageId,annotationId) {
    
}

async function _getMultiAnnotation(pool,imageId,annotationIds) {
    let sql = 'SELECT d.image_id,a.id,a.type,a.class, a.recognition, ' + 
                    'p.x AS point_x, p.y AS point_y, ' +
                    'b.x1 AS bbox_x1, b.y1 AS bbox_y1, b.x2 AS bbox_x2, b.y2 AS bbox_y2, b.width AS bbox_width, b.height AS bbox_height, ' + 
                    'pg.x AS polygon_x, pg.y AS polygon_y, pl.x AS polyline_x, pl.y AS polyline_y ' +
            'FROM s_road_annotation2020.workplace AS d ' + 
            'JOIN s_road_annotation2020.annotation AS a ' + 
                'ON d.id=a.task_id ' +
                'LEFT JOIN s_road_annotation2020.point AS p ' + 
                    'ON (a.id=p.annotation_id AND a.type=\'point\') ' +
                'LEFT JOIN s_road_annotation2020.bbox AS b ' +
                    'ON (a.id=b.annotation_id AND a.type=\'bbox\') ' +
                'LEFT JOIN s_road_annotation2020.polygon AS pg ' + 
                    'ON (a.id=pg.annotation_id AND a.type=\'polygon\') ' + 
                'LEFT JOIN s_road_annotation2020.polyline AS pl ' + 
                    'ON (a.id=pl.annotation_id AND a.type=\'polyline\') ' +
            'WHERE d.image_id=?'
    if (!annotationIds.includes('all')) {
        sql += ' AND a.id IN ('
        for(let annotationId of annotationIds.slice(0,-1)) {
            sql += util.format('%d,',annotationId)
        }
        sql += util.format('%d)',annotationIds[annotationIds.length-1])
    }

    sql += ' ORDER BY a.id, p.id, b.id, pl.id, pg.id'
    
    const rows = await pool.query(sql,imageId);


    let annoatatation_result = rows[0].reduce((r,a) => {
        r['image_id'] = a.image_id;
        if(!r['annotations']){
            
            const annotationData = {
                'shape_id' : a.id,
                'shape_type' : a.type,
                'class' : a.class,
                'recognition' : a.recognition
            }

            switch (a.type) {
                case SHAPE_TYPE.POINT :
                    annotationData[a.type] = {'x' : a.point_x, 'y' : a.point_y} 
                    break;
                case SHAPE_TYPE.BBOX :
                    annotationData[a.type] = [{'x' : a.bbox_x1, 'y' : a.bbox_y1},{'x' : a.bbox_x2, 'y' : a.bbox_y2},{'width' : a.bbox_width, 'height' : a.bbox_height}]
                    break;
                case SHAPE_TYPE.POLYLINE :
                    annotationData[a.type] = [{'x' : a.polyline_x, 'y' : a.polyline_y}]
                    break;
                case SHAPE_TYPE.POLYGON :
                    annotationData[a.type] = [{'x' : a.polygon_x, 'y' : a.polygon_y}]
            }

            r['annotations'] = [annotationData]

        }else if (r['annotations'][r['annotations'].length-1]['shape_id'] === a.id){
            const shapeData =  r['annotations'][r['annotations'].length-1][a.type]
            switch (a.type) {
                case SHAPE_TYPE.POLYLINE :
                    r['annotations'][r['annotations'].length-1][a.type].push({'x' : a.polyline_x, 'y' : a.polyline_y})
                    break;
                case SHAPE_TYPE.POLYGON :
                    r['annotations'][r['annotations'].length-1][a.type].push({'x' : a.polygon_x, 'y' : a.polygon_y})
            }
        }else{
            const annotationData = {
                'shape_id' : a.id,
                'shape_type' : a.type,
                'class' : a.class,
                'recognition' : a.recognition
            }

            switch (a.type) {
                case SHAPE_TYPE.POINT :
                    annotationData[a.type] = {'x' : a.point_x, 'y' : a.point_y} 
                    break;
                case SHAPE_TYPE.BBOX :
                    annotationData[a.type] = [{'x' : a.bbox_x1, 'y' : a.bbox_y1},{'x' : a.bbox_x2, 'y' : a.bbox_y2},{'width' : a.bbox_width, 'height' : a.bbox_height}]
                    break;
                case SHAPE_TYPE.POLYLINE :
                    annotationData[a.type] = [{'x' : a.polyline_x, 'y' : a.polyline_y}]
                    break;
                case SHAPE_TYPE.POLYGON :
                    annotationData[a.type] = [{'x' : a.polygon_x, 'y' : a.polygon_y}]
            }

            r['annotations'].push(annotationData)
        }

         return r;
    },{})
    console.log(util.inspect(annoatatation_result, {showHidden: false, depth: null}))
    return annoatatation_result
}


function _addAnnotationFunc(pool) {
    return async(imageId,inputData) => {
        if ('annotations' in inputData) {

        } else {
            const type = inputData['shape_type'];
            const _class = inputData['class'];
            const recognition = inputData['recognition'];
            const shape = inputData[type];
            let memo = null;
        
            if('memo' in inputData) {
                memo = inputData['memo'];
            }
            //single
            const annotation_id = await addSingleAnnotation(imageId,type,_class,recognition,shape,memo,pool)
            return annotation_id;
        }
    }
}

function _putAnnotationFunc(pool) {
    return async(imageId,putData) =>{
        if(Array.isArray(putData)){

        } else {
            const shapeId = putData['shape_id'];
            const type = putData['shape_type'];
            const _class = putData['class'];
            const recognition = putData['recognition'];
            const shape = putData[type];
            let memo = null;
        
            if('memo' in putData) {
                memo = putData['memo'];
            }
            return await updateSingleAnnotation(imageId,shapeId,type,_class,recognition,shape,memo,pool);
        }
    }
}
function _patchAnnotationFunc(pool) {
    return async(patchData) => {

    }
}
function _deleteAnnotationFunc(pool) {
    return async(imageId,annotationId,completely) => {
        if(Array.isArray(annotationId)){

        } else {
            await deleteSingleAnnotation(annotationId,completely,pool);
            return
        }
    }
}

function _commitTask(pool) {
    return async(imageId) => {
        const commitRes = await pool.query('CALL commit_task(?)',imageId);
        return commitRes[0][0]
    }
}

function _assignTaskIntoWorkplace(pool) {
    return async(imageId) => {
        await pool.query('CALL load_task(?)',imageId)
    }
}

async function addSingleAnnotation(imageId,type,_class,recognition,shape,memo,pool) {

    const taskRow = await pool.query('SELECT id FROM workplace WHERE image_id=?',imageId)
    const taskId = taskRow[0][0].id
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const sql = 'INSERT INTO annotation(type,task_id,class,recognition) VALUES(?,?,?,?)'
        const insertRes = await connection.query(sql,[type,taskId,_class,recognition]);
        const annotationId =insertRes[0].insertId
        switch(type) {
            case SHAPE_TYPE.POINT:
                const x = shape['x'];
                const y = shape['y'];
                const pointSql = 'INSERT INTO point(x,y,annotation_id) VALUES(?,?,?)'
                await connection.query(pointSql,[x,y,annotationId])
                break;
            case SHAPE_TYPE.BBOX:
                const x1 = shape[0]['x'];
                const y1 = shape[0]['y'];
                const x2 = shape[1]['x'];
                const y2 = shape[1]['y'];
                const width = shape[2]['width'];
                const height = shape[2]['height'];
                const bboxSql = 'INSERT INTO bbox(x1,y1,x2,y2,width,height,annotation_id) VALUES(?,?,?,?,?,?,?)'
                await connection.query(bboxSql,[x1,y1,x2,y2,width,height,annotationId])
                break;  
            case SHAPE_TYPE.POLYLINE:
                const polyline = shape.map(point => [point['x'],point['y'],annotationId]);
                const polylineSql = 'INSERT INTO polyline(x,y,annotation_id) VALUES ?'
                await connection.query(polylineSql,[polyline]);
                break;
            case SHAPE_TYPE.POLYGON:
                const polygon = shape.map(point => [point['x'],point['y'],annotationId]);
                console.log(polygon)
                const polygonSql = 'INSERT INTO polygon(x,y,annotation_id) VALUES ?'
                await connection.query(polygonSql,[polygon]);
                break;
        }

        if(memo){
            const memo_sql = 'INSERT INTO memo(content,annotation_id) VALUES(?,?)'
            await connection.query(memo_sql,[memo,annotationId])
        }

        

        await  connection.commit()
        return annotationId;

    } catch (err) {
        connection.rollback()
        throw err;
    } finally {
        connection.release();
    }
}

async function updateSingleAnnotation(imageId,annotationId,type,_class,recognition,shape,memo,pool){
    
    const row = await pool.query('SELECT type FROM annotation WHERE id=?',annotationId);
    const oldType = row[0][0].type
    
    const connection = await pool.getConnection();
    try {
        const deleteShapeSql = util.format('DELETE FROM %s WHERE annotation_id=?',oldType)
        await connection.query(deleteShapeSql,annotationId)

        const deleteMemoSql = 'DELETE FROM memo WHERE annotation_id=?'
        await connection.query(deleteMemoSql,annotationId)

        const updateSql = 'UPDATE s_road_annotation2020.annotation SET task_id = (SELECT id FROM workplace WHERE image_id=?),type=?,class=?,recognition=? WHERE id=?'
        await connection.query(updateSql,[imageId,type,_class,recognition,annotationId])

        switch(type) {
            case SHAPE_TYPE.POINT:
                const x = shape['x'];
                const y = shape['y'];
                const pointSql = 'INSERT INTO point(x,y,annotation_id) VALUES(?,?,?)'
                await connection.query(pointSql,[x,y,annotationId])
                break;
            case SHAPE_TYPE.BBOX:
                const x1 = shape[0]['x'];
                const y1 = shape[0]['y'];
                const x2 = shape[1]['x'];
                const y2 = shape[1]['y'];
                const width = shape[2]['width'];
                const height = shape[2]['height'];
                const bboxSql = 'INSERT INTO bbox(x1,y1,x2,y2,width,height,annotation_id) VALUES(?,?,?,?,?,?,?)'
                await connection.query(bboxSql,[x1,y1,x2,y2,width,height,annotationId])
                break;  
            case SHAPE_TYPE.POLYLINE:
                const polyline = shape.map(point => [point['x'],point['y'],annotationId]);
                const polylineSql = 'INSERT INTO polyline(x,y,annotation_id) VALUES ?'
                await connection.query(polylineSql,[polyline]);
                break;
            case SHAPE_TYPE.POLYGON:
                const polygon = shape.map(point => [point['x'],point['y'],annotationId]);
                console.log(polygon)
                const polygonSql = 'INSERT INTO polygon(x,y,annotation_id) VALUES ?'
                await connection.query(polygonSql,[polygon]);
                break;
        }

        if(memo){
            const memo_sql = 'INSERT INTO memo(content,annotation_id) VALUES(?,?)'
            await connection.query(memo_sql,[memo,annotationId])
        }

        version = (await connection.query('SELECT version FROM annotation WHERE id=?',annotationId))[0][0].version

        await  connection.commit()

        return {
            'image_id' : imageId,
            'shape_id' : annotationId,
            'version' : version
        }

    } catch (err) {
        connection.rollback()
        throw err;
    } finally {
        connection.release();
    }
}

async function deleteSingleAnnotation(annotationId,completely,pool){
    dbRes = await pool.query('CALL delete_annotation(?,?)',[annotationId,completely])   
    console.log(dbRes)
}

