const Koa = require('koa');
const IO = require('koa-socket');
const cors = require('kcors');
const route = require('koa-route');
const rawBody = require('raw-body');
const config = require('../config');
const {getOrigin, getTodayList, pastInquiry, getNewsDetailById, getFilteredList} = require('./DAO');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const compress = require('koa-compress');
const convert = require('koa-convert');// convert generator to async, support koa2
const moment = require('moment');

const app = new Koa();
const io = new IO();

app.use(compress({
    filter: function (content_type) {
        return /[text|json|javascript]/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH,
}));
app.use(conditional());
app.use(etag());

//static serve
app.use(require('koa-static')('../public', {index: 'index.html'}));

// Origin verification generator
function verifyOrigin(ctx) {
    let validOrigins = [
        'https://autonews.berlinchan.com',
        'http://localhost:3091',
        'http://localhost:4000',
    ];

    const origin = ctx.headers.origin;
    if (!(validOrigins.indexOf(origin) !== -1)) return false;
    return origin;
}
app.use(convert(cors({origin: verifyOrigin})));

io.attach(app);

//route
//查询来源列表
app.use(route.get('/getOrigin', async function (ctx, next) {
    await getOrigin().then(doc => {
        ctx.status = 200;
        ctx.set('Expires', moment().add({days: 2}).utc());
        ctx.body = {data: doc, msg: 'success'};
    });
}));
//按(开始时间: date，结束时间: date，origin_key: string)查询list
app.use(route.get('/getTodayList', async function (ctx, next) {
    await getTodayList(ctx.query.origin_key).then(doc => {
        ctx.status = 200;
        ctx.body = {data: doc, msg: 'success'};
    });
}));
//按(开始时间: date，结束时间: date，origin_key: string)查询detail
app.use(route.get('/pastInquiry', async function (ctx, next) {
    await pastInquiry(ctx.query.origin, ctx.query.beginDate, ctx.query.endDate, ctx.query.keyword, ctx.query.current, ctx.query.pageSize).then(doc => {
        ctx.status = 200;
        ctx.body = {
            data: doc,
            msg: 'success'
        };
    });
}));
// getDetailById
app.use(route.get('/getNewsDetailById', async function (ctx, next) {
    await getNewsDetailById(ctx.query.id).then(doc => {
        ctx.status = 200;
        ctx.body = {
            data: doc,
            msg: 'success'
        };
    });
}));
app.use(route.post('/listItem_added', async function (ctx) {
    ctx.status = 200;
    ctx.req.body = await rawBody(ctx.req, {limit: '10kb', encoding: 'utf8'});
    ctx.req.body = JSON.parse(ctx.req.body);
    ctx.body = {data: undefined, msg: 'success'};
    //broadcast socket event
    app.io.broadcast('action',
        {type: 'socket_global_ON_News_Added', data: ctx.req.body});
}));
// 查询已筛选项目详情
app.use(route.get('/getFilteredList', async function (ctx) {
    await getFilteredList(ctx.query.id).then(doc => {
        ctx.status = 200;
        ctx.body = {
            data: doc,
            msg: 'success'
        };
    });
}));


// koa-socket events
app.io.on('connection', async (ctx, id) => {
    console.log('connect client: ', id);
    //广播客户端连接数
    app.io.broadcast('action',
        {type: 'socket_Global_SET_clientCount', data: app.io.connections.size});
});

// redux actions handler
app.io.on('action', (action) => {
    switch (action.type) {
        case 'socket/demo':
            console.log(action.msg);
            app.io.broadcast('action',
                {type: 'Monitor_EMIT_RECEIVED', msg: 'good day!'});
            break;
        default:
    }
});


app.listen(process.env.PORT || config.HTTP_PORT);
