exports.getUsers = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Fetching Users'
  });
};

exports.createUser = async (req, res) => {
  res.status(200).json({
    status: 'failure',
    message: 'No data defined'
  });
};

exports.getUserById = async (req, res) => {
  res.status(200).json({
    status: 'failure',
    message: 'No id defined'
  });
};
