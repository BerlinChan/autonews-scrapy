/**
 * Created by berlin on 2017/3/15.
 * 处理数据库连接与数据读写
 */

const config = require('./config');
const monk = require('monk');
const db = monk(config.DB_SERVER);
const colors = require('colors');

// reCreate collection & index
async function initDb() {
    await db.get('origin').drop()
        .then(result => {
            return db.get('origin').insert(
                [
                    {"_id": monk.id("58cb5e1237e1e826b4530627"), "key": "ctdsb", "name": "楚天都市报"},
                    {"_id": monk.id("58cb5e1237e1e826b4530628"), "key": "hbrb", "name": "湖北日报"},
                    {"_id": monk.id("58cb5e1237e1e826b4530629"), "key": "sxwb", "name": "三峡晚报"},
                    {"_id": monk.id("58cb5e1237e1e826b453062a"), "key": "ctkb", "name": "楚天快报"},
                    {"_id": monk.id("58cb5e1237e1e826b453062b"), "key": "ctjb", "name": "楚天金报"},
                    {"_id": monk.id("58cb5e1237e1e826b453062c"), "key": "txdcw", "name": "腾讯大楚网"},
                    {"_id": monk.id("58cb5e1237e1e826b453062d"), "key": "ctsb", "name": "楚天时报"},
                    {"_id": monk.id("58d53490fc20345298a738bc"), "key": "whwb", "name": "武汉晚报"},
                    {"_id": monk.id("58d55029fc20345298a738bd"), "key": "cjrb", "name": "长江日报"},
                    {"_id": monk.id("58d55038fc20345298a738be"), "key": "whcb", "name": "武汉晨报"},
                    {"_id": monk.id("58e92e6bc587da6d85b94ec3"), "key": "rmw_hb", "name": "人民网-湖北频道"},
                ]
            );
        })
        .then(result => {
            db.get('origin').index({'key': 1}, {unique: true, background: true});
            db.get('origin').index({'name': 1}, {unique: true, background: true});
        })
        .then(result => {
            console.log('Create collection:', 'origin'.yellow, ' OK.');
        });
    await db.get('detail').drop()
        .then(result => {
            db.get('detail').index({'title': 1}, {background: true});
            db.get('detail').index({'origin_key': 1}, {background: true});
            db.get('detail').index({'date': -1}, {background: true});
        })
        .then(result => {
            console.log('Create collection:', 'detail'.yellow, ' OK.');
        });
    await db.close();
}

initDb().then(result => {
    console.log('DB init complete.'.green); // outputs green text
    process.exit(0);
});
