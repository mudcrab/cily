exports.view = {

	path: '/:id',
	method: 'get',

	handler: function(req, res)
	{
		return res.json({ lol: false });
	}
};

exports.save = {

	path: '/:id/save',
	method: 'post|patch',

	handler: function(req, res)
	{
		return res.json({});
	}
};

exports.remove = {

	path: '/:id/remove',
	method: 'delete',

	handler: function(req, res)
	{
		return res.json({});
	}
};