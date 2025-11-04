const facturasController = {
  getAll: (req, res) => {
    res.json({ msg: 'Todas las facturas' });
  },
  getById: (req, res) => {
    res.json({ msg: `Factura con id ${req.params.id}` });
  },
  create: (req, res) => {
    res.json({ msg: 'Factura creada', data: req.body });
  },
  update: (req, res) => {
    res.json({ msg: `Factura ${req.params.id} actualizada`, data: req.body });
  },
  remove: (req, res) => {
    res.json({ msg: `Factura ${req.params.id} eliminada` });
  }
};

export default facturasController;
