## 删除重复记录

    db.list.aggregate([{$group:{_id:"$title", dups:{$push:"$_id"}, count: {$sum: 1}}},
    {$match:{count: {$gt: 1}}}
    ]).forEach(function(doc){
      doc.dups.shift();
      db.list.remove({_id : {$in: doc.dups}});
    });