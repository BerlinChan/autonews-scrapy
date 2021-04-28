/**
 * Created by Berlin on 2017/3/17.
 */

const config = require('../config');
const monk = require('monk');
const db = monk(config.DB_SERVER);
const moment = require('moment');

//查询来源列表
function getOrigin() {
    return db.get('origin').find({});
}

//获取当日 news list
async function getTodayList(origin_key) {
    const todayDate = new Date(moment().format('YYYY-MM-DD'));
    const tomorrowDate = new Date(moment().add({days: 1}).format('YYYY-MM-DD'));
    let origin_key_array = [];
    if (origin_key) {
        origin_key_array = origin_key.split(',');
    } else {
        const allOrigin = await db.get('origin').find({}, {fields: 'key'});
        allOrigin.forEach(item => origin_key_array.push(item.key));
    }

    return db.get('detail').find(
        {
            "date": {
                $gte: new Date(Date.parse(todayDate) - 28800000),
                $lt: new Date(Date.parse(tomorrowDate) - 28800000)
            }, //减去8小时？
            "origin_key": {$in: origin_key_array}
        },
        {sort: {'date': -1}, fields: '_id title subTitle url date nlpSentiment'}
    );
}

/*
 * 查询往期数据
 *
 * 参数：
 *   beginDate：    开始时间
 *   endDate：      结束时间
 *   origin_key：   来源key，多个以","分割
 *   keyword：       标题关键字
 *   current：       查询页面
 *   pageSize：      每页数量
 */
async function pastInquiry(origin = '', beginDate, endDate, keyword = '', current = 1, pageSize = 20) {
    let origin_key_array = origin.split(',');
    let query = {
        "date": {
            $gte: new Date(Date.parse(beginDate) - 28800000),
            $lt: new Date(Date.parse(endDate) - 28800000)
        }, //减去8小时？
        "origin_key": {$in: origin_key_array},
    };
    if (keyword) {
        query['title'] = eval(`/${keyword}/i`);
    }

    let detailList = await db.get('detail').find(
        query,
        {
            sort: {'date': -1},
            fields: '-content',
            limit: parseInt(pageSize),
            skip: (parseInt(current) - 1) * parseInt(pageSize),
        }
    );
    let totalList = await db.get('detail').count(query);

    return {
        list: detailList,
        pagination: {current: parseInt(current), pageSize: parseInt(pageSize), total: parseInt(totalList)},
    };
}

/*
 * 通过 id 查询 news detail
 *
 * 参数：
 *   id：对应数据库 detail collection _id field
 */
function getNewsDetailById(id) {
    return db.get('detail').findOne({"_id": id});
}

/*
 * 根据id查询已筛选的列表
 * 参数：
 *     id:以逗号","分割的 id 字符串
 */
function getFilteredList(id) {
    let idList = id.split(',');
    return db.get('detail').find({_id: {$in: idList}}, {fields: '-content'});
}


module.exports = {
    getOrigin,
    getTodayList,
    pastInquiry,
    getNewsDetailById,
    getFilteredList,
};