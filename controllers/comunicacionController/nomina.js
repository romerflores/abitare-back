const nominaController = {
  getAll: (req, res) => {
    res.json({ msg: 'Toda la nómina' });
  },
  getById: (req, res) => {
    res.json({ msg: `Empleado de nómina con id ${req.params.id}` });
  },
  create: (req, res) => {
    res.json({ msg: 'Empleado añadido a nómina', data: req.body });
  },
  update: (req, res) => {
    res.json({ msg: `Empleado ${req.params.id} actualizado`, data: req.body });
  },
  remove: (req, res) => {
    res.json({ msg: `Empleado ${req.params.id} eliminado de nómina` });
  }
};

export default nominaController;
