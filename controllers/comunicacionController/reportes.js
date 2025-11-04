const reportesController = {
  getAll: (req, res) => {
    res.json({ msg: 'Todos los reportes generados' });
  },
  getById: (req, res) => {
    res.json({ msg: `Reporte con id ${req.params.id}` });
  },
  create: (req, res) => {
    res.json({ msg: 'Reporte generado', data: req.body });
  },
  remove: (req, res) => {
    res.json({ msg: `Reporte ${req.params.id} eliminado` });
  }
};

export default reportesController;
