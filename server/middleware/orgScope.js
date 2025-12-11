export const requireOrgScope = (req, res, next) => {
  const orgId = req.params.orgId || req.body.orgId || req.query.orgId;
  
  if (!orgId) {
    return res.status(400).json({ message: 'Organization ID required' });
  }

  if (orgId !== req.user.orgId) {
    return res.status(403).json({ message: 'Access denied to this organization' });
  }

  req.orgId = orgId;
  next();
};
