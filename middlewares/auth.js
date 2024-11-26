exports.isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }
    next();
  };
  
  exports.isOwner = (model) => async (req, res, next) => {
    const item = await model.findById(req.params.id);
    if (!item || !item.createdBy.equals(req.session.userId)) {
      return res.redirect('/songs');
    }
    next();
  };
  