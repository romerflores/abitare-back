const morosidadController = {
  getAll: (req, res) => {
    res.json({ msg: 'Todos los registros de morosidad' });
  },
  getById: (req, res) => {
    res.json({ msg: `Registro de morosidad con id ${req.params.id}` });
  },
  create: (req, res) => {
    res.json({ msg: 'Registro de morosidad creado', data: req.body });
  },
  update: (req, res) => {
    res.json({ msg: `Registro de morosidad ${req.params.id} actualizado`, data: req.body });
  },
  remove: (req, res) => {
    res.json({ msg: `Registro de morosidad ${req.params.id} eliminado` });
  }
};

export default morosidadController;
